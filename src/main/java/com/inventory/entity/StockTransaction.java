package com.inventory.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_transactions")
public class StockTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String sku;
    
    @Column(name = "product_name", nullable = false)
    private String productName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(name = "previous_quantity")
    private Integer previousQuantity;
    
    @Column(name = "new_quantity")
    private Integer newQuantity;
    
    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;
    
    @Column(name = "performed_by")
    private Long performedBy;
    
    @Column(name = "notes")
    private String notes;
    
    
    public StockTransaction() {}
    
    public StockTransaction(String sku, String productName, TransactionType transactionType, 
                           Integer quantity, Integer previousQuantity, Integer newQuantity, 
                           Long performedBy) {
        this.sku = sku;
        this.productName = productName;
        this.transactionType = transactionType;
        this.quantity = quantity;
        this.previousQuantity = previousQuantity;
        this.newQuantity = newQuantity;
        this.transactionDate = LocalDateTime.now();
        this.performedBy = performedBy;
    }
    
    
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
    
    public TransactionType getTransactionType() {
        return transactionType;
    }
    
    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public Integer getPreviousQuantity() {
        return previousQuantity;
    }
    
    public void setPreviousQuantity(Integer previousQuantity) {
        this.previousQuantity = previousQuantity;
    }
    
    public Integer getNewQuantity() {
        return newQuantity;
    }
    
    public void setNewQuantity(Integer newQuantity) {
        this.newQuantity = newQuantity;
    }
    
    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }
    
    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }
    
    public Long getPerformedBy() {
        return performedBy;
    }
    
    public void setPerformedBy(Long performedBy) {
        this.performedBy = performedBy;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
}