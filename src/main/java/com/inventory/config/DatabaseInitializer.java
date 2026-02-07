package com.inventory.config;

import com.inventory.entity.Role;
import com.inventory.entity.User;
import com.inventory.entity.UserStatus;
import com.inventory.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatabaseInitializer {
    
    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, 
                                         PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if MASTER_ADMIN already exists
            if (userRepository.findByEmail("master@admin.com").isEmpty()) {
                User masterAdmin = new User();
                masterAdmin.setEmail("master@admin.com");
                masterAdmin.setPassword(passwordEncoder.encode("Master@123"));
                masterAdmin.setFirstName("Master");
                masterAdmin.setLastName("Admin");
                masterAdmin.setRole(Role.MASTER_ADMIN);
                masterAdmin.setStatus(UserStatus.ACTIVE);
                masterAdmin.setDeleted(false);
                
                userRepository.save(masterAdmin);
                System.out.println("MASTER_ADMIN user created successfully");
            }
        };
    }
}