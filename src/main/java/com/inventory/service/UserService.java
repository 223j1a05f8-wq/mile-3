package com.inventory.service;

import com.inventory.dto.UserDTO;
import com.inventory.entity.Role;
import com.inventory.entity.User;
import com.inventory.entity.UserStatus;
import com.inventory.exception.DuplicateResourceException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Transactional
    public UserDTO.UserResponse createUser(UserDTO.CreateUserRequest request, Long createdBy) {
        if (userRepository.existsByEmailAndIsDeleted(request.getEmail(), false)) {
            throw new DuplicateResourceException("User with email " + request.getEmail() + " already exists");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(Role.valueOf(request.getRole()));
        user.setStatus(UserStatus.ACTIVE);
        user.setPassword(passwordEncoder.encode("Password@123")); // Default password
        
        User saved = userRepository.save(user);
        return toUserResponse(saved);
    }
    
    @Transactional
    public void deleteUser(Long userId, Long deletedBy) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setDeleted(true);
        user.setDeletedAt(LocalDateTime.now());
        user.setStatus(UserStatus.DELETED);
        userRepository.save(user);
    }
    
    @Transactional
    public void restoreUser(Long userId, Long restoredBy) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setDeleted(false);
        user.setDeletedAt(null);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }
    
    public List<UserDTO.UserResponse> getAllUsers() {
        return userRepository.findByIsDeleted(false).stream()
            .map(this::toUserResponse)
            .collect(Collectors.toList());
    }
    
    public List<UserDTO.UserResponse> getDeletedUsers() {
        return userRepository.findByIsDeleted(true).stream()
            .map(this::toUserResponse)
            .collect(Collectors.toList());
    }
    
    public List<UserDTO.UserResponse> getUsersByRole(String roleStr) {
        Role role = Role.valueOf(roleStr);
        return userRepository.findByRoleAndIsDeleted(role, false).stream()
            .map(this::toUserResponse)
            .collect(Collectors.toList());
    }
    
    public UserDTO.UserSummary getUserSummary() {
        UserDTO.UserSummary summary = new UserDTO.UserSummary();
        
        long totalUsers = userRepository.findByIsDeleted(false).size();
        long masterAdmins = userRepository.countActiveByRole(Role.MASTER_ADMIN);
        long admins = userRepository.countActiveByRole(Role.ADMIN);
        long employees = userRepository.countActiveByRole(Role.EMPLOYEE);
        long deletedUsers = userRepository.findByIsDeleted(true).size();
        
        summary.setTotalUsers(totalUsers);
        summary.setActiveUsers(totalUsers);
        summary.setMasterAdmins(masterAdmins);
        summary.setAdmins(admins);
        summary.setEmployees(employees);
        summary.setDeletedUsers(deletedUsers);
        
        return summary;
    }
    
    private UserDTO.UserResponse toUserResponse(User user) {
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
}
