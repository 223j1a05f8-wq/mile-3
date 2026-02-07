package com.inventory.controller;

import com.inventory.service.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class PasswordResetController {

    private PasswordResetService passwordResetService;

    
    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        passwordResetService.forgotPassword(email);
        return ResponseEntity.ok("Password reset email sent successfully");
    }

    /**
     * Reset Password API
     * Resets password using valid token
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {

        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body("Reset token is required");
        }

        if (newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("New password is required");
        }

        passwordResetService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Password reset successful");
    }
}
