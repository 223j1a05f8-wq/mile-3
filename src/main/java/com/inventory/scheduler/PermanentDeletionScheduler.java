package com.inventory.scheduler;

import com.inventory.entity.Product;
import com.inventory.entity.User;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class PermanentDeletionScheduler {
    
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    
    @Value("${app.permanent-delete-days:5}")
    private int permanentDeleteDays;
    
    public PermanentDeletionScheduler(UserRepository userRepository, 
                                     ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }
    
    @Scheduled(cron = "0 0 2 * * ?") // Run daily at 2 AM
    @Transactional
    public void permanentlyDeleteSoftDeletedRecords() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(permanentDeleteDays);
        
        // Permanently delete users
        List<User> usersToDelete = userRepository
                .findByIsDeletedAndDeletedAtBefore(true, cutoffDate);
        userRepository.deleteAll(usersToDelete);
        
        // Permanently delete products
        List<Product> productsToDelete = productRepository
                .findByIsDeletedAndDeletedAtBefore(true, cutoffDate);
        productRepository.deleteAll(productsToDelete);
        
        // Log the cleanup 
        System.out.println("Permanently deleted " + usersToDelete.size() + 
                         " users and " + productsToDelete.size() + " products");
    }
}