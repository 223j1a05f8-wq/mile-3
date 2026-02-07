import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const StockManagement = ({ type }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await adminAPI.getAllProducts();
      setProducts(response.data.filter(p => !p.isDeleted));
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const filteredProducts = searchTerm
    ? products.filter(p =>
        p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    setLoading(true);
    try {
      const stockData = {
        sku: selectedProduct.sku,
        quantity: parseInt(quantity),
        notes,
      };

      if (type === 'IN') {
        await adminAPI.stockIn(stockData);
        toast.success(`Successfully added ${quantity} units to stock`);
      } else {
        await adminAPI.stockOut(stockData);
        toast.success(`Successfully removed ${quantity} units from stock`);
      }

      // Reset form
      setSelectedProduct(null);
      setQuantity('');
      setNotes('');
      setSearchTerm('');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || `Stock ${type.toLowerCase()} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-management">
      <h1>Stock {type === 'IN' ? 'In' : 'Out'}</h1>
      <p className="subtitle">
        {type === 'IN' ? 'Add stock to inventory' : 'Remove stock from inventory'}
      </p>

      <div className="stock-form-container">
        <form onSubmit={handleSubmit} className="stock-form">
          <div className="form-group">
            <label>Search Product *</label>
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSelectedProduct(null)}
              />
            </div>

            {searchTerm && !selectedProduct && filteredProducts.length > 0 && (
              <div className="search-results">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="search-result-item"
                    onClick={() => {
                      setSelectedProduct(product);
                      setSearchTerm(product.productName);
                    }}
                  >
                    <div>
                      <strong>{product.productName}</strong>
                      <span className="sku-badge">{product.sku}</span>
                    </div>
                    <span className="current-stock">Stock: {product.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedProduct && (
            <div className="selected-product-info">
              <h3>Selected Product</h3>
              <div className="product-details">
                <div className="detail-item">
                  <span className="label">Product:</span>
                  <span className="value">{selectedProduct.productName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">SKU:</span>
                  <span className="value">{selectedProduct.sku}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Current Stock:</span>
                  <span className="value">{selectedProduct.quantity}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Category:</span>
                  <span className="value">{selectedProduct.category}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes (optional)"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className={`btn ${type === 'IN' ? 'btn-success' : 'btn-warning'}`}
            disabled={loading || !selectedProduct}
          >
            {loading ? 'Processing...' : `Stock ${type === 'IN' ? 'In' : 'Out'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockManagement;
