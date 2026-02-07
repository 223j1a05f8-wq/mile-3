package com.inventory.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDTO {
    
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;
        
        @NotBlank(message = "Password is required")
        private String password;
        
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
    
    public static class LoginResponse {
        private String token;
        private String email;
        private String role;
        private String firstName;
        private String lastName;
        
        
        public LoginResponse(String token, String email, String role, 
                           String firstName, String lastName) {
            this.token = token;
            this.email = email;
            this.role = role;
            this.firstName = firstName;
            this.lastName = lastName;
        }
        
        
        public String getToken() {
            return token;
        }
        
        public String getEmail() {
            return email;
        }
        
        public String getRole() {
            return role;
        }
        
        public String getFirstName() {
            return firstName;
        }
        
        public String getLastName() {
            return lastName;
        }
    }
}