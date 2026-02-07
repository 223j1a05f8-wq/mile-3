package com.inventory.service;

import com.inventory.dto.ProductDTO;
import com.inventory.dto.ReportDTO;
import com.inventory.entity.AuditLog;
import com.inventory.entity.Product;
import com.inventory.entity.StockTransaction;
import com.inventory.entity.TransactionType;
import com.inventory.exception.DuplicateResourceException;
import com.inventory.exception.InsufficientStockException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.AuditLogRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.StockTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final AuditLogRepository auditLogRepository;
    
    public ProductService(ProductRepository productRepository,
                         StockTransactionRepository stockTransactionRepository,
                         AuditLogRepository auditLogRepository) {
        this.productRepository = productRepository;
        this.stockTransactionRepository = stockTransactionRepository;
        this.auditLogRepository = auditLogRepository;
    }
    
    @Transactional
    public ProductDTO.ProductResponse createProduct(ProductDTO.CreateProductRequest request, Long createdBy) {
        String sku = generateSku(request.getCategory());
        
        if (productRepository.findBySku(sku).isPresent()) {
            throw new DuplicateResourceException("Product", "sku", sku);
        }
        
        Product product = new Product();
        product.setSku(sku);
        product.setProductName(request.getProductName());
        product.setCategory(request.getCategory());
        product.setSupplier(request.getSupplier());
        product.setUnitPrice(request.getUnitPrice());
        product.setQuantity(request.getQuantity());
        product.setMinStockThreshold(request.getMinStockThreshold());
        product.setCreatedBy(createdBy);
        
        Product savedProduct = productRepository.save(product);
        
        auditLogRepository.save(new AuditLog(
            createdBy,
            null,
            "CREATE_PRODUCT",
            "Product",
            savedProduct.getId(),
            String.format("Created product %s (SKU: %s)", savedProduct.getProductName(), savedProduct.getSku()),
            null
        ));
        
        if (request.getQuantity() > 0) {
            StockTransaction transaction = new StockTransaction(
                savedProduct.getSku(),
                savedProduct.getProductName(),
                TransactionType.STOCK_IN,
                request.getQuantity(),
                0,
                request.getQuantity(),
                createdBy
            );
            stockTransactionRepository.save(transaction);
        }
        
        return convertToProductResponse(savedProduct);
    }
    
    @Transactional
    public ProductDTO.ProductResponse updateProduct(Long productId, ProductDTO.UpdateProductRequest request, Long updatedBy) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        
        if (product.isDeleted()) {
            throw new ResourceNotFoundException("Product", "id", productId);
        }
        
        product.setProductName(request.getProductName());
        product.setCategory(request.getCategory());
        product.setSupplier(request.getSupplier());
        product.setLastUpdatedBy(updatedBy);
        
        Product savedProduct = productRepository.save(product);
        
        auditLogRepository.save(new AuditLog(
            updatedBy,
            null,
            "UPDATE_PRODUCT",
            "Product",
            productId,
            String.format("Updated product %s (SKU: %s)", savedProduct.getProductName(), savedProduct.getSku()),
            null
        ));
        
        return convertToProductResponse(savedProduct);
    }
    
    @Transactional
    public void deleteProduct(Long productId, Long deletedBy) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        
        if (product.isDeleted()) {
            throw new ResourceNotFoundException("Product", "id", productId);
        }
        
        product.setDeleted(true);
        product.setDeletedAt(LocalDateTime.now());
        productRepository.save(product);
        
        auditLogRepository.save(new AuditLog(
            deletedBy,
            null,
            "DELETE_PRODUCT",
            "Product",
            productId,
            String.format("Deleted product %s (SKU: %s)", product.getProductName(), product.getSku()),
            null
        ));
    }
    
    @Transactional
    public void restoreProduct(Long productId, Long restoredBy) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        
        if (!product.isDeleted()) {
            throw new IllegalStateException("Product is not deleted");
        }
        
        product.setDeleted(false);
        product.setDeletedAt(null);
        productRepository.save(product);
        
        auditLogRepository.save(new AuditLog(
            restoredBy,
            null,
            "RESTORE_PRODUCT",
            "Product",
            productId,
            String.format("Restored product %s (SKU: %s)", product.getProductName(), product.getSku()),
            null
        ));
    }
    
    public List<ProductDTO.ProductResponse> getAllProducts() {
        return productRepository.findByIsDeleted(false).stream()
            .map(this::convertToProductResponse)
            .collect(Collectors.toList());
    }
    
    public ProductDTO.ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySkuAndIsDeleted(sku, false)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "sku", sku));
        return convertToProductResponse(product);
    }
    
    public List<ProductDTO.ProductResponse> searchProducts(String query) {
        return productRepository.searchProducts(query).stream()
            .map(this::convertToProductResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public ProductDTO.ProductResponse stockIn(ProductDTO.StockUpdateRequest request, Long performedBy) {
        Product product = productRepository.findBySkuAndIsDeleted(request.getSku(), false)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "sku", request.getSku()));
        
        int previousQuantity = product.getQuantity();
        int newQuantity = previousQuantity + request.getQuantity();
        
        product.setQuantity(newQuantity);
        product.setLastUpdatedBy(performedBy);
        Product savedProduct = productRepository.save(product);
        
        StockTransaction transaction = new StockTransaction(
            product.getSku(),
            product.getProductName(),
            TransactionType.STOCK_IN,
            request.getQuantity(),
            previousQuantity,
            newQuantity,
            performedBy
        );
        transaction.setNotes(request.getNotes());
        stockTransactionRepository.save(transaction);
        
        auditLogRepository.save(new AuditLog(
            performedBy,
            null,
            "STOCK_IN",
            "Product",
            product.getId(),
            String.format("Stock in %d units for %s (SKU: %s)", request.getQuantity(), product.getProductName(), product.getSku()),
            null
        ));
        
        return convertToProductResponse(savedProduct);
    }
    
    @Transactional
    public ProductDTO.ProductResponse stockOut(ProductDTO.StockUpdateRequest request, Long performedBy) {
        Product product = productRepository.findBySkuAndIsDeleted(request.getSku(), false)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "sku", request.getSku()));
        
        int previousQuantity = product.getQuantity();
        
        if (previousQuantity < request.getQuantity()) {
            throw new InsufficientStockException(product.getProductName(), previousQuantity, request.getQuantity());
        }
        
        int newQuantity = previousQuantity - request.getQuantity();
        
        product.setQuantity(newQuantity);
        product.setLastUpdatedBy(performedBy);
        Product savedProduct = productRepository.save(product);
        
        StockTransaction transaction = new StockTransaction(
            product.getSku(),
            product.getProductName(),
            TransactionType.STOCK_OUT,
            request.getQuantity(),
            previousQuantity,
            newQuantity,
            performedBy
        );
        transaction.setNotes(request.getNotes());
        stockTransactionRepository.save(transaction);
        
        auditLogRepository.save(new AuditLog(
            performedBy,
            null,
            "STOCK_OUT",
            "Product",
            product.getId(),
            String.format("Stock out %d units for %s (SKU: %s)", request.getQuantity(), product.getProductName(), product.getSku()),
            null
        ));
        
        return convertToProductResponse(savedProduct);
    }
    
    public ReportDTO.InventorySummary getInventorySummary() {
        ReportDTO.InventorySummary summary = new ReportDTO.InventorySummary();
        
        Long totalProducts = productRepository.getTotalProducts();
        Long totalQuantity = productRepository.getTotalQuantity();
        BigDecimal totalValue = productRepository.getTotalInventoryValue();
        
        summary.setTotalProducts(totalProducts != null ? totalProducts : 0);
        summary.setTotalQuantity(totalQuantity != null ? totalQuantity : 0);
        summary.setTotalValue(totalValue != null ? totalValue : BigDecimal.ZERO);
        
        List<Product> lowStockProducts = productRepository.findByIsDeleted(false).stream()
            .filter(p -> p.getQuantity() <= p.getMinStockThreshold())
            .collect(Collectors.toList());
        summary.setLowStockItems(lowStockProducts.size());
        
        return summary;
    }
    
    public List<ReportDTO.CategoryReport> getCategoryWiseReport() {
        List<Object[]> results = productRepository.getCategoryWiseSummary();
        
        return results.stream()
            .map(row -> new ReportDTO.CategoryReport(
                (String) row[0],
                ((Number) row[1]).longValue(),
                ((Number) row[2]).longValue(),
                (BigDecimal) row[3]
            ))
            .collect(Collectors.toList());
    }
    
    public List<ProductDTO.ProductResponse> getLowStockProducts() {
        return productRepository.findByIsDeleted(false).stream()
            .filter(p -> p.getQuantity() <= p.getMinStockThreshold())
            .map(this::convertToProductResponse)
            .collect(Collectors.toList());
    }
    
    private ProductDTO.ProductResponse convertToProductResponse(Product product) {
        ProductDTO.ProductResponse response = new ProductDTO.ProductResponse();
        response.setId(product.getId());
        response.setSku(product.getSku());
        response.setProductName(product.getProductName());
        response.setCategory(product.getCategory());
        response.setSupplier(product.getSupplier());
        response.setUnitPrice(product.getUnitPrice());
        response.setQuantity(product.getQuantity());
        response.setTotalValue(product.getTotalValue());
        response.setMinStockThreshold(product.getMinStockThreshold());
        response.setLowStock(product.getQuantity() <= product.getMinStockThreshold());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        response.setDeleted(product.isDeleted());
        return response;
    }
    
    private String generateSku(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Category cannot be empty");
        }
        
        String prefix = category.toUpperCase().substring(0, Math.min(3, category.length()));
        
        String lastSku = productRepository.findLastSku(prefix).orElse(null);
        
        int nextNumber = 1;
        if (lastSku != null && lastSku.contains("-")) {
            try {
                String[] parts = lastSku.split("-");
                if (parts.length >= 2 && !parts[1].isEmpty()) {
                    nextNumber = Integer.parseInt(parts[1]) + 1;
                }
            } catch (NumberFormatException e) {
                nextNumber = 1;
            }
        }
        
        return String.format("%s-%04d", prefix, nextNumber);
    }
}
