package com.inventory.controller;

import com.inventory.dto.UserDTO;
import com.inventory.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/master-admin")
@PreAuthorize("hasRole('MASTER_ADMIN')")
public class MasterAdminController {
    
    private final UserService userService;
    
    public MasterAdminController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping("/users")
    public ResponseEntity<UserDTO.UserResponse> createUser(@Valid @RequestBody UserDTO.CreateUserRequest request) {
        // In real implementation, get userId from security context
        Long createdBy = 1L; // MASTER_ADMIN id
        UserDTO.UserResponse response = userService.createUser(request, createdBy);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        Long deletedBy = 1L; 
        userService.deleteUser(userId, deletedBy);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/users/{userId}/restore")
    public ResponseEntity<Void> restoreUser(@PathVariable Long userId) {
        Long restoredBy = 1L; 
        userService.restoreUser(userId, restoredBy);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO.UserResponse>> getAllUsers() {
        List<UserDTO.UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/summary")
    public ResponseEntity<UserDTO.UserSummary> getUserSummary() {
        UserDTO.UserSummary summary = userService.getUserSummary();
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<UserDTO.UserResponse>> getUsersByRole(@PathVariable String role) {
        List<UserDTO.UserResponse> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }
}