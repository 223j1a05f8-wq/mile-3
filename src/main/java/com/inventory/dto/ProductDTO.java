package com.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDTO {
    
    public static class CreateProductRequest {
        @NotBlank(message = "Product name is required")
        private String productName;
        
        @NotBlank(message = "Category is required")
        private String category;
        
        @NotBlank(message = "Supplier is required")
        private String supplier;
        
        @NotNull(message = "Unit price is required")
        @Min(value = 0, message = "Unit price must be positive")
        private BigDecimal unitPrice;
        
        @NotNull(message = "Quantity is required")
        @Min(value = 0, message = "Quantity must be positive")
        private Integer quantity;
        
        private Integer minStockThreshold = 10;
        
        // Getters and Setters
        public String getProductName() {
            return productName;
        }
        
        public void setProductName(String productName) {
            this.productName = productName;
        }
        
        public String getCategory() {
            return category;
        }
        
        public void setCategory(String category) {
            this.category = category;
        }
        
        public String getSupplier() {
            return supplier;
        }
        
        public void setSupplier(String supplier) {
            this.supplier = supplier;
        }
        
        public BigDecimal getUnitPrice() {
            return unitPrice;
        }
        
        public void setUnitPrice(BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
        }
        
        public Integer getQuantity() {
            return quantity;
        }
        
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
        
        public Integer getMinStockThreshold() {
            return minStockThreshold;
        }
        
        public void setMinStockThreshold(Integer minStockThreshold) {
            this.minStockThreshold = minStockThreshold;
        }
    }
    
    public static class UpdateProductRequest {
        @NotBlank(message = "Product name is required")
        private String productName;
        
        @NotBlank(message = "Category is required")
        private String category;
        
        @NotBlank(message = "Supplier is required")
        private String supplier;
        
        // Getters and Setters
        public String getProductName() {
            return productName;
        }
        
        public void setProductName(String productName) {
            this.productName = productName;
        }
        
        public String getCategory() {
            return category;
        }
        
        public void setCategory(String category) {
            this.category = category;
        }
        
        public String getSupplier() {
            return supplier;
        }
        
        public void setSupplier(String supplier) {
            this.supplier = supplier;
        }
    }
    
    public static class ProductResponse {
        private Long id;
        private String sku;
        private String productName;
        private String category;
        private String supplier;
        private BigDecimal unitPrice;
        private Integer quantity;
        private BigDecimal totalValue;
        private Integer minStockThreshold;
        private boolean lowStock;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private boolean isDeleted;
        
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getSku() {
            return sku;
        }
        
        public void setSku(String sku) {
            this.sku = sku;
        }
        
        public String getProductName() {
            return productName;
        }
        
        public void setProductName(String productName) {
            this.productName = productName;
        }
        
        public String getCategory() {
            return category;
        }
        
        public void setCategory(String category) {
            this.category = category;
        }
        
        public String getSupplier() {
            return supplier;
        }
        
        public void setSupplier(String supplier) {
            this.supplier = supplier;
        }
        
        public BigDecimal getUnitPrice() {
            return unitPrice;
        }
        
        public void setUnitPrice(BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
        }
        
        public Integer getQuantity() {
            return quantity;
        }
        
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
        
        public BigDecimal getTotalValue() {
            return totalValue;
        }
        
        public void setTotalValue(BigDecimal totalValue) {
            this.totalValue = totalValue;
        }
        
        public Integer getMinStockThreshold() {
            return minStockThreshold;
        }
        
        public void setMinStockThreshold(Integer minStockThreshold) {
            this.minStockThreshold = minStockThreshold;
        }
        
        public boolean isLowStock() {
            return lowStock;
        }
        
        public void setLowStock(boolean lowStock) {
            this.lowStock = lowStock;
        }
        
        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
        
        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
        
        public LocalDateTime getUpdatedAt() {
            return updatedAt;
        }
        
        public void setUpdatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
        }
        
        public boolean isDeleted() {
            return isDeleted;
        }
        
        public void setDeleted(boolean deleted) {
            isDeleted = deleted;
        }
    }
    
    public static class StockUpdateRequest {
        @NotBlank(message = "SKU is required")
        private String sku;
        
        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be positive")
        private Integer quantity;
        
        private String notes;
        
        
        public String getSku() {
            return sku;
        }
        
        public void setSku(String sku) {
            this.sku = sku;
        }
        
        public Integer getQuantity() {
            return quantity;
        }
        
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
        
        public String getNotes() {
            return notes;
        }
        
        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}