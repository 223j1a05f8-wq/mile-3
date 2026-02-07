package com.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class ReportDTO {
    
    public static class InventorySummary {
        private long totalProducts;
        private long totalQuantity;
        private BigDecimal totalValue;
        private long lowStockItems;
        
        
        public long getTotalProducts() {
            return totalProducts;
        }
        
        public void setTotalProducts(long totalProducts) {
            this.totalProducts = totalProducts;
        }
        
        public long getTotalQuantity() {
            return totalQuantity;
        }
        
        public void setTotalQuantity(long totalQuantity) {
            this.totalQuantity = totalQuantity;
        }
        
        public BigDecimal getTotalValue() {
            return totalValue;
        }
        
        public void setTotalValue(BigDecimal totalValue) {
            this.totalValue = totalValue;
        }
        
        public long getLowStockItems() {
            return lowStockItems;
        }
        
        public void setLowStockItems(long lowStockItems) {
            this.lowStockItems = lowStockItems;
        }
    }
    
    public static class CategoryReport {
        private String category;
        private long productCount;
        private long totalQuantity;
        private BigDecimal totalValue;
        
        
        public CategoryReport(String category, long productCount, 
                            long totalQuantity, BigDecimal totalValue) {
            this.category = category;
            this.productCount = productCount;
            this.totalQuantity = totalQuantity;
            this.totalValue = totalValue;
        }
        
        
        public String getCategory() {
            return category;
        }
        
        public long getProductCount() {
            return productCount;
        }
        
        public long getTotalQuantity() {
            return totalQuantity;
        }
        
        public BigDecimal getTotalValue() {
            return totalValue;
        }
    }
    
    public static class TimePeriodReport {
        private LocalDate startDate;
        private LocalDate endDate;
        private List<CategoryReport> categoryReports;
        private InventorySummary summary;
        private Map<String, Long> transactionSummary;
        
        
        public LocalDate getStartDate() {
            return startDate;
        }
        
        public void setStartDate(LocalDate startDate) {
            this.startDate = startDate;
        }
        
        public LocalDate getEndDate() {
            return endDate;
        }
        
        public void setEndDate(LocalDate endDate) {
            this.endDate = endDate;
        }
        
        public List<CategoryReport> getCategoryReports() {
            return categoryReports;
        }
        
        public void setCategoryReports(List<CategoryReport> categoryReports) {
            this.categoryReports = categoryReports;
        }
        
        public InventorySummary getSummary() {
            return summary;
        }
        
        public void setSummary(InventorySummary summary) {
            this.summary = summary;
        }
        
        public Map<String, Long> getTransactionSummary() {
            return transactionSummary;
        }
        
        public void setTransactionSummary(Map<String, Long> transactionSummary) {
            this.transactionSummary = transactionSummary;
        }
    }
}