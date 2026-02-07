package com.inventory.service;

import com.inventory.entity.StockTransaction;
import com.inventory.entity.TransactionType;
import com.inventory.repository.StockTransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockTransactionService {
    
    private final StockTransactionRepository stockTransactionRepository;
    
    public StockTransactionService(StockTransactionRepository stockTransactionRepository) {
        this.stockTransactionRepository = stockTransactionRepository;
    }
    
    public List<StockTransaction> searchTransactions(String sku, String productName, 
                                                     String transactionType, LocalDate startDate, LocalDate endDate) {
        TransactionType type = null;
        if (transactionType != null && !transactionType.isEmpty()) {
            try {
                type = TransactionType.valueOf(transactionType);
            } catch (IllegalArgumentException e) {
                type = null;
            }
        }
        
        LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTime = endDate != null ? endDate.atTime(23, 59, 59) : null;
        
        return stockTransactionRepository.searchTransactions(
            sku, 
            productName, 
            type, 
            startDateTime, 
            endDateTime
        );
    }
}
