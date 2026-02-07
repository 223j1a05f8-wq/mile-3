package com.inventory.repository;

import com.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findBySku(String sku);
    
    Optional<Product> findBySkuAndIsDeleted(String sku, boolean isDeleted);
    
    List<Product> findByIsDeleted(boolean isDeleted);
    
    List<Product> findByIsDeletedAndDeletedAtBefore(boolean isDeleted, LocalDateTime deletedAt);
    
    List<Product> findByCategoryAndIsDeleted(String category, boolean isDeleted);
    
    List<Product> findByQuantityLessThanAndIsDeleted(Integer threshold, boolean isDeleted);
    
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND " +
           "(LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Product> searchProducts(@Param("search") String search);
    
    @Query("SELECT SUM(p.quantity) FROM Product p WHERE p.isDeleted = false")
    Long getTotalQuantity();
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.isDeleted = false")
    Long getTotalProducts();
    
    @Query("SELECT SUM(p.unitPrice * p.quantity) FROM Product p WHERE p.isDeleted = false")
    BigDecimal getTotalInventoryValue();
    
    @Query("SELECT p.category, COUNT(p), SUM(p.quantity), SUM(p.unitPrice * p.quantity) " +
           "FROM Product p WHERE p.isDeleted = false GROUP BY p.category")
    List<Object[]> getCategoryWiseSummary();
    
    @Query("SELECT MAX(p.sku) FROM Product p WHERE p.sku LIKE :prefix%")
    Optional<String> findLastSku(@Param("prefix") String prefix);
}