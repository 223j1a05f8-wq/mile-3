package com.inventory.service;

import com.inventory.dto.AuthDTO;
import com.inventory.dto.UserDTO;
import com.inventory.entity.AuditLog;
import com.inventory.entity.Role;
import com.inventory.entity.User;
import com.inventory.entity.UserStatus;
import com.inventory.exception.DuplicateResourceException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.exception.UnauthorizedException;
import com.inventory.repository.AuditLogRepository;
import com.inventory.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, 
                      AuditLogRepository auditLogRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Transactional
    public UserDTO.UserResponse createUser(UserDTO.CreateUserRequest request, Long createdBy) {
        if (userRepository.existsByEmailAndIsDeleted(request.getEmail(), false)) {
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(Role.valueOf(request.getRole()));
        user.setStatus(UserStatus.ACTIVE);
        
        String tempPassword = generateTemporaryPassword();
        user.setPassword(passwordEncoder.encode(tempPassword));
        
        User savedUser = userRepository.save(user);
        
        auditLogRepository.save(new AuditLog(
            createdBy,
            null,
            "CREATE_USER",
            "User",
            savedUser.getId(),
            String.format("Created user %s with role %s", savedUser.getEmail(), savedUser.getRole()),
            null
        ));
        
        return convertToUserResponse(savedUser);
    }
    
    @Transactional
    public void deleteUser(Long userId, Long deletedBy) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        if (user.isDeleted()) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        
        user.setDeleted(true);
        user.setDeletedAt(LocalDateTime.now());
        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);
        
        auditLogRepository.save(new AuditLog(
            deletedBy,
            null,
            "DELETE_USER",
            "User",
            userId,
            String.format("Deleted user %s", user.getEmail()),
            null
        ));
    }
    
    @Transactional
    public void restoreUser(Long userId, Long restoredBy) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        if (!user.isDeleted()) {
            throw new IllegalStateException("User is not deleted");
        }
        
        user.setDeleted(false);
        user.setDeletedAt(null);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        
        auditLogRepository.save(new AuditLog(
            restoredBy,
            null,
            "RESTORE_USER",
            "User",
            userId,
            String.format("Restored user %s", user.getEmail()),
            null
        ));
    }
    
    public List<UserDTO.UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::convertToUserResponse)
            .collect(Collectors.toList());
    }
    
    public UserDTO.UserSummary getUserSummary() {
        List<User> allUsers = userRepository.findAll();
        
        UserDTO.UserSummary summary = new UserDTO.UserSummary();
        summary.setTotalAdmins(allUsers.stream()
            .filter(u -> !u.isDeleted() && u.getRole() == Role.ADMIN)
            .count());
        summary.setTotalEmployees(allUsers.stream()
            .filter(u -> !u.isDeleted() && u.getRole() == Role.EMPLOYEE)
            .count());
        summary.setTotalActiveUsers(allUsers.stream()
            .filter(u -> !u.isDeleted())
            .count());
        summary.setTotalDeletedUsers(allUsers.stream()
            .filter(User::isDeleted)
            .count());
        
        return summary;
    }
    
    public List<UserDTO.UserResponse> getUsersByRole(String role) {
        Role roleEnum = Role.valueOf(role);
        return userRepository.findByRoleAndIsDeleted(roleEnum, false).stream()
            .map(this::convertToUserResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public AuthDTO.LoginResponse login(AuthDTO.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        
        if (user.isDeleted()) {
            throw new UnauthorizedException("User account is deleted");
        }
        
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new UnauthorizedException("User account is inactive");
        }
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        auditLogRepository.save(new AuditLog(
            user.getId(),
            user.getEmail(),
            "LOGIN",
            "User",
            user.getId(),
            String.format("User %s logged in", user.getEmail()),
            null
        ));
        
        String token = generateJwtToken(user);
        
        return new AuthDTO.LoginResponse(
            token,
            user.getEmail(),
            user.getRole().name(),
            user.getFirstName(),
            user.getLastName()
        );
    }
    
    private UserDTO.UserResponse convertToUserResponse(User user) {
        UserDTO.UserResponse response = new UserDTO.UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole().name());
        response.setStatus(user.getStatus().name());
        response.setCreatedAt(user.getCreatedAt());
        response.setLastLogin(user.getLastLogin());
        response.setDeleted(user.isDeleted());
        return response;
    }
    
    private String generateTemporaryPassword() {
        return UUID.randomUUID().toString().substring(0, 12);
    }
    
    private String generateJwtToken(User user) {
        return "jwt-token-" + user.getId() + "-" + System.currentTimeMillis();
    }
}
