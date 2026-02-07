package com.inventory.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class UserDTO {
    
    public static class CreateUserRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;
        
        private String firstName;
        private String lastName;
        
        @NotNull(message = "Role is required")
        private String role;
        

        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getFirstName() {
            return firstName;
        }
        
        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }
        
        public String getLastName() {
            return lastName;
        }
        
        public void setLastName(String lastName) {
            this.lastName = lastName;
        }
        
        public String getRole() {
            return role;
        }
        
        public void setRole(String role) {
            this.role = role;
        }
    }
    
    public static class UserResponse {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime lastLogin;
        private boolean isDeleted;
        
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getFirstName() {
            return firstName;
        }
        
        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }
        
        public String getLastName() {
            return lastName;
        }
        
        public void setLastName(String lastName) {
            this.lastName = lastName;
        }
        
        public String getRole() {
            return role;
        }
        
        public void setRole(String role) {
            this.role = role;
        }
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
        
        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
        
        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
        
        public LocalDateTime getLastLogin() {
            return lastLogin;
        }
        
        public void setLastLogin(LocalDateTime lastLogin) {
            this.lastLogin = lastLogin;
        }
        
        public boolean isDeleted() {
            return isDeleted;
        }
        
        public void setDeleted(boolean deleted) {
            isDeleted = deleted;
        }
    }
    
    public static class UserSummary {
        private long totalUsers;
        private long activeUsers;
        private long deletedUsers;
        private long masterAdmins;
        private long admins;
        private long employees;
        
        
        public long getTotalUsers() {
            return totalUsers;
        }
        
        public void setTotalUsers(long totalUsers) {
            this.totalUsers = totalUsers;
        }
        
        public long getActiveUsers() {
            return activeUsers;
        }
        
        public void setActiveUsers(long activeUsers) {
            this.activeUsers = activeUsers;
        }
        
        public long getDeletedUsers() {
            return deletedUsers;
        }
        
        public void setDeletedUsers(long deletedUsers) {
            this.deletedUsers = deletedUsers;
        }
        
        public long getMasterAdmins() {
            return masterAdmins;
        }
        
        public void setMasterAdmins(long masterAdmins) {
            this.masterAdmins = masterAdmins;
        }
        
        public long getAdmins() {
            return admins;
        }
        
        public void setAdmins(long admins) {
            this.admins = admins;
        }
        
        public long getEmployees() {
            return employees;
        }
        
        public void setEmployees(long employees) {
            this.employees = employees;
        }
    }
}