package com.inventory.controller;

import com.inventory.dto.ProductDTO;
import com.inventory.dto.ReportDTO;
import com.inventory.dto.UserDTO;
import com.inventory.service.ProductService;
import com.inventory.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final ProductService productService;
    private final UserService userService;
    
    public AdminController(ProductService productService, UserService userService) {
        this.productService = productService;
        this.userService = userService;
    }
    
    
    @PostMapping("/products")
    public ResponseEntity<ProductDTO.ProductResponse> createProduct(
            @Valid @RequestBody ProductDTO.CreateProductRequest request) {
        Long createdBy = 2L; // Admin id from security context
        ProductDTO.ProductResponse response = productService.createProduct(request, createdBy);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/products/{productId}")
    public ResponseEntity<ProductDTO.ProductResponse> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductDTO.UpdateProductRequest request) {
        Long updatedBy = 2L; 
        ProductDTO.ProductResponse response = productService.updateProduct(productId, request, updatedBy);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        Long deletedBy = 2L; 
        productService.deleteProduct(productId, deletedBy);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/products/{productId}/restore")
    public ResponseEntity<Void> restoreProduct(@PathVariable Long productId) {
        Long restoredBy = 2L; 
        productService.restoreProduct(productId, restoredBy);
        return ResponseEntity.ok().build();
    }
    
    
    @PostMapping("/stock/in")
    public ResponseEntity<ProductDTO.ProductResponse> stockIn(
            @Valid @RequestBody ProductDTO.StockUpdateRequest request) {
        Long performedBy = 2L; 
        ProductDTO.ProductResponse response = productService.stockIn(request, performedBy);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/stock/out")
    public ResponseEntity<ProductDTO.ProductResponse> stockOut(
            @Valid @RequestBody ProductDTO.StockUpdateRequest request) {
        Long performedBy = 2L; // Admin id from security context
        ProductDTO.ProductResponse response = productService.stockOut(request, performedBy);
        return ResponseEntity.ok(response);
    }
    
    // Reports
    @GetMapping("/reports/inventory-summary")
    public ResponseEntity<ReportDTO.InventorySummary> getInventorySummary() {
        ReportDTO.InventorySummary summary = productService.getInventorySummary();
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/reports/category-wise")
    public ResponseEntity<List<ReportDTO.CategoryReport>> getCategoryWiseReport() {
        List<ReportDTO.CategoryReport> reports = productService.getCategoryWiseReport();
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/reports/low-stock")
    public ResponseEntity<List<ProductDTO.ProductResponse>> getLowStockProducts() {
        List<ProductDTO.ProductResponse> products = productService.getLowStockProducts();
        return ResponseEntity.ok(products);
    }
    
    // Employee Visibility
    @GetMapping("/employees")
    public ResponseEntity<List<UserDTO.UserResponse>> getEmployees() {
        List<UserDTO.UserResponse> employees = userService.getUsersByRole("EMPLOYEE");
        return ResponseEntity.ok(employees);
    }
    
    @GetMapping("/employees/count")
    public ResponseEntity<Long> getEmployeeCount() {
        List<UserDTO.UserResponse> employees = userService.getUsersByRole("EMPLOYEE");
        return ResponseEntity.ok((long) employees.size());
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
    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO.ProductResponse>> getAllProducts() {
        List<ProductDTO.ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
}