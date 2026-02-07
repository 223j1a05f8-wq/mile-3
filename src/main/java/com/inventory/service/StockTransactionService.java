package com.inventory.service;

import com.inventory.entity.StockTransaction;
import com.inventory.entity.TransactionType;
import com.inventory.repository.StockTransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class StockTransactionService {
    
    private final StockTransactionRepository stockTransactionRepository;
    
    public StockTransactionService(StockTransactionRepository stockTransactionRepository) {
        this.stockTransactionRepository = stockTransactionRepository;
    }
    
    public List<StockTransaction> searchTransactions(
            String sku, 
            String productName, 
            String transactionTypeStr,
            LocalDate startDate, 
            LocalDate endDate) {
        
        TransactionType transactionType = null;
        if (transactionTypeStr != null && !transactionTypeStr.isEmpty()) {
            transactionType = TransactionType.valueOf(transactionTypeStr);
        }
        
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        
        if (startDate != null) {
            startDateTime = startDate.atStartOfDay();
        }
        
        if (endDate != null) {
            endDateTime = endDate.atTime(LocalTime.MAX);
        }
        
        return stockTransactionRepository.searchTransactions(
            sku, 
            productName, 
            transactionType, 
            startDateTime, 
            endDateTime
        );
    }
    
    public List<StockTransaction> getAllTransactions() {
        return stockTransactionRepository.findAll();
    }
    
    public List<StockTransaction> getTransactionsBySku(String sku) {
        return stockTransactionRepository.findBySkuOrderByTransactionDateDesc(sku);
    }
}
