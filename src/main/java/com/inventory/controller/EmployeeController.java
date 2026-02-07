package com.inventory.controller;

import com.inventory.dto.ProductDTO;
import com.inventory.dto.ReportDTO;
import com.inventory.entity.StockTransaction;
import com.inventory.service.ProductService;
import com.inventory.service.StockTransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/employee")
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeController {
    
    private final ProductService productService;
    private final StockTransactionService stockTransactionService;
    
    public EmployeeController(ProductService productService, 
                             StockTransactionService stockTransactionService) {
        this.productService = productService;
        this.stockTransactionService = stockTransactionService;
    }
    
    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO.ProductResponse>> getAllProducts() {
        List<ProductDTO.ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/products/{sku}")
    public ResponseEntity<ProductDTO.ProductResponse> getProductBySku(@PathVariable String sku) {
        ProductDTO.ProductResponse product = productService.getProductBySku(sku);
        return ResponseEntity.ok(product);
    }
    
    @GetMapping("/products/search")
    public ResponseEntity<List<ProductDTO.ProductResponse>> searchProducts(
            @RequestParam String query) {
        List<ProductDTO.ProductResponse> products = productService.searchProducts(query);
        return ResponseEntity.ok(products);
    }
    
    @PostMapping("/stock/in")
    public ResponseEntity<ProductDTO.ProductResponse> stockIn(
            @Valid @RequestBody ProductDTO.StockUpdateRequest request) {
        Long performedBy = 3L; 
        ProductDTO.ProductResponse response = productService.stockIn(request, performedBy);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/stock/out")
    public ResponseEntity<ProductDTO.ProductResponse> stockOut(
            @Valid @RequestBody ProductDTO.StockUpdateRequest request) {
        Long performedBy = 3L; 
        ProductDTO.ProductResponse response = productService.stockOut(request, performedBy);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/transactions")
    public ResponseEntity<List<StockTransaction>> getTransactions(
            @RequestParam(required = false) String sku,
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) String transactionType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<StockTransaction> transactions = stockTransactionService.searchTransactions(
                sku, productName, transactionType, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/reports/inventory-summary")
    public ResponseEntity<ReportDTO.InventorySummary> getInventorySummary() {
        ReportDTO.InventorySummary summary = productService.getInventorySummary();
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/reports/low-stock")
    public ResponseEntity<List<ProductDTO.ProductResponse>> getLowStockProducts() {
        List<ProductDTO.ProductResponse> products = productService.getLowStockProducts();
        return ResponseEntity.ok(products);
    }
}