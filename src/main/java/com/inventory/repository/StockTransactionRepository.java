package com.inventory.repository;

import com.inventory.entity.StockTransaction;
import com.inventory.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    
    List<StockTransaction> findBySkuOrderByTransactionDateDesc(String sku);
    
    List<StockTransaction> findByProductNameContainingIgnoreCaseOrderByTransactionDateDesc(String productName);
    
    List<StockTransaction> findByTransactionTypeOrderByTransactionDateDesc(TransactionType transactionType);
    
    List<StockTransaction> findByTransactionDateBetweenOrderByTransactionDateDesc(
            LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT st FROM StockTransaction st WHERE " +
           "(:sku IS NULL OR st.sku = :sku) AND " +
           "(:productName IS NULL OR LOWER(st.productName) LIKE LOWER(CONCAT('%', :productName, '%'))) AND " +
           "(:transactionType IS NULL OR st.transactionType = :transactionType) AND " +
           "(:startDate IS NULL OR st.transactionDate >= :startDate) AND " +
           "(:endDate IS NULL OR st.transactionDate <= :endDate) " +
           "ORDER BY st.transactionDate DESC")
    List<StockTransaction> searchTransactions(
            @Param("sku") String sku,
            @Param("productName") String productName,
            @Param("transactionType") TransactionType transactionType,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT st.transactionType, SUM(st.quantity) " +
           "FROM StockTransaction st " +
           "WHERE st.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY st.transactionType")
    List<Object[]> getTransactionSummary(@Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);
}