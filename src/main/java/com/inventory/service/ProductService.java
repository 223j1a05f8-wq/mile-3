package com.inventory.service;

import com.inventory.dto.ProductDTO;
import com.inventory.dto.ReportDTO;
import com.inventory.entity.Product;
import com.inventory.entity.TransactionType;
import com.inventory.exception.DuplicateResourceException;
import com.inventory.exception.InsufficientStockException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.StockTransactionRepository;
import com.inventory.entity.StockTransaction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    private static final int SKU_PREFIX_LENGTH = 3;
    
    private final ProductRepository productRepository;
    private final StockTransactionRepository stockTransactionRepository;
    
    public ProductService(ProductRepository productRepository, 
                         StockTransactionRepository stockTransactionRepository) {
        this.productRepository = productRepository;
        this.stockTransactionRepository = stockTransactionRepository;
    }
    
    @Transactional
    public ProductDTO.ProductResponse createProduct(ProductDTO.CreateProductRequest request, Long createdBy) {
        String sku = generateSku(request.getCategory());
        
        if (productRepository.findBySku(sku).isPresent()) {
            throw new DuplicateResourceException("Product with SKU " + sku + " already exists");
        }
        
        Product product = new Product(
            sku,
            request.getProductName(),
            request.getCategory(),
            request.getSupplier(),
            request.getUnitPrice(),
            request.getQuantity()
        );
        product.setMinStockThreshold(request.getMinStockThreshold());
        product.setCreatedBy(createdBy);
        
        Product saved = productRepository.save(product);
        return toProductResponse(saved);
    }
    
    @Transactional
    public ProductDTO.ProductResponse updateProduct(Long productId, ProductDTO.UpdateProductRequest request, Long updatedBy) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        product.setProductName(request.getProductName());
        product.setCategory(request.getCategory());
        product.setSupplier(request.getSupplier());
        product.setLastUpdatedBy(updatedBy);
        
        Product saved = productRepository.save(product);
        return toProductResponse(saved);
    }
    
    @Transactional
    public void deleteProduct(Long productId, Long deletedBy) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        product.setDeleted(true);
        product.setDeletedAt(LocalDateTime.now());
        product.setLastUpdatedBy(deletedBy);
        productRepository.save(product);
    }
    
    @Transactional
    public void restoreProduct(Long productId, Long restoredBy) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        product.setDeleted(false);
        product.setDeletedAt(null);
        product.setLastUpdatedBy(restoredBy);
        productRepository.save(product);
    }
    
    @Transactional
    public ProductDTO.ProductResponse stockIn(ProductDTO.StockUpdateRequest request, Long performedBy) {
        Product product = productRepository.findBySkuAndIsDeleted(request.getSku(), false)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with SKU: " + request.getSku()));
        
        Integer previousQuantity = product.getQuantity();
        Integer newQuantity = previousQuantity + request.getQuantity();
        product.setQuantity(newQuantity);
        product.setLastUpdatedBy(performedBy);
        
        // Create transaction record
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
        
        Product saved = productRepository.save(product);
        return toProductResponse(saved);
    }
    
    @Transactional
    public ProductDTO.ProductResponse stockOut(ProductDTO.StockUpdateRequest request, Long performedBy) {
        Product product = productRepository.findBySkuAndIsDeleted(request.getSku(), false)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with SKU: " + request.getSku()));
        
        Integer previousQuantity = product.getQuantity();
        if (previousQuantity < request.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock. Available: " + previousQuantity);
        }
        
        Integer newQuantity = previousQuantity - request.getQuantity();
        product.setQuantity(newQuantity);
        product.setLastUpdatedBy(performedBy);
        
        // Create transaction record
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
        
        Product saved = productRepository.save(product);
        return toProductResponse(saved);
    }
    
    public List<ProductDTO.ProductResponse> getAllProducts() {
        return productRepository.findByIsDeleted(false).stream()
            .map(this::toProductResponse)
            .collect(Collectors.toList());
    }
    
    public List<ProductDTO.ProductResponse> getDeletedProducts() {
        return productRepository.findByIsDeleted(true).stream()
            .map(this::toProductResponse)
            .collect(Collectors.toList());
    }
    
    public ProductDTO.ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySkuAndIsDeleted(sku, false)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with SKU: " + sku));
        return toProductResponse(product);
    }
    
    public List<ProductDTO.ProductResponse> searchProducts(String query) {
        return productRepository.searchProducts(query).stream()
            .map(this::toProductResponse)
            .collect(Collectors.toList());
    }
    
    public ReportDTO.InventorySummary getInventorySummary() {
        ReportDTO.InventorySummary summary = new ReportDTO.InventorySummary();
        
        Long totalProducts = productRepository.getTotalProducts();
        Long totalQuantity = productRepository.getTotalQuantity();
        BigDecimal totalValue = productRepository.getTotalInventoryValue();
        
        List<Product> lowStockProducts = productRepository.findByIsDeleted(false).stream()
            .filter(p -> p.getQuantity() <= p.getMinStockThreshold())
            .collect(Collectors.toList());
        
        summary.setTotalProducts(totalProducts != null ? totalProducts : 0);
        summary.setTotalQuantity(totalQuantity != null ? totalQuantity : 0);
        summary.setTotalValue(totalValue != null ? totalValue : BigDecimal.ZERO);
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
            .map(this::toProductResponse)
            .collect(Collectors.toList());
    }
    
    private String generateSku(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Category cannot be empty");
        }
        
        String prefix = category.substring(0, Math.min(SKU_PREFIX_LENGTH, category.length())).toUpperCase();
        String lastSku = productRepository.findLastSku(prefix).orElse(prefix + "000");
        
        try {
            int number = Integer.parseInt(lastSku.substring(prefix.length())) + 1;
            return String.format("%s%03d", prefix, number);
        } catch (NumberFormatException | StringIndexOutOfBoundsException e) {
            // If SKU format is corrupted, start fresh
            return String.format("%s001", prefix);
        }
    }
    
    private ProductDTO.ProductResponse toProductResponse(Product product) {
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
        response.setDeletedAt(product.getDeletedAt());
        response.setDeleted(product.isDeleted());
        return response;
    }
}
