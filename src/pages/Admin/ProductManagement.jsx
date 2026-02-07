import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { formatCurrency, formatDate } from '../../utils/helpers';

const PRODUCT_CATEGORIES = [
  'Electronics',
  'Furniture',
  'Stationery',
  'Food & Beverages',
  'Clothing & Apparel',
  'Hardware & Tools',
  'Office Supplies',
  'Medical & Healthcare',
  'Automotive',
  'Books & Media',
  'Toys & Games',
  'Sports & Fitness',
  'Home & Garden',
  'Beauty & Personal Care',
  'Industrial Equipment',
  'Other'
];

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    supplier: '',
    unitPrice: '',
    quantity: '',
    minStockThreshold: 10,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await adminAPI.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await adminAPI.updateProduct(currentProduct.id, {
          productName: formData.productName,
          category: formData.category,
          supplier: formData.supplier,
        });
        toast.success('Product updated successfully');
      } else {
        await adminAPI.createProduct(formData);
        toast.success('Product created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setCurrentProduct(product);
    setFormData({
      productName: product.productName,
      category: product.category,
      supplier: product.supplier,
      unitPrice: product.unitPrice,
      quantity: product.quantity,
      minStockThreshold: product.minStockThreshold,
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(productId);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleRestore = async (productId) => {
    try {
      await adminAPI.restoreProduct(productId);
      toast.success('Product restored successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to restore product');
    }
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      category: '',
      supplier: '',
      unitPrice: '',
      quantity: '',
      minStockThreshold: 10,
    });
    setEditMode(false);
    setCurrentProduct(null);
  };

  return (
    <div className="product-management">
      <div className="page-header">
        <div>
          <h1>Product Management</h1>
          <p>Manage your inventory products</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="search-box">
        <FiSearch />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className={product.isDeleted ? 'deleted-row' : ''}>
                  <td>{product.sku}</td>
                  <td>{product.productName}</td>
                  <td>{product.category}</td>
                  <td>{product.supplier}</td>
                  <td>{formatCurrency(product.unitPrice)}</td>
                  <td className={product.lowStock ? 'text-red' : ''}>
                    {product.quantity}
                    {product.lowStock && ' ⚠️'}
                  </td>
                  <td>{formatCurrency(product.totalValue)}</td>
                  <td>
                    <span className={`status-badge ${product.isDeleted ? 'deleted' : 'active'}`}>
                      {product.isDeleted ? 'Deleted' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {product.isDeleted ? (
                        <button
                          className="btn-icon btn-success"
                          onClick={() => handleRestore(product.id)}
                          title="Restore"
                        >
                          <FiRefreshCw />
                        </button>
                      ) : (
                        <>
                          <button
                            className="btn-icon btn-primary"
                            onClick={() => handleEdit(product)}
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="btn-icon btn-danger"
                            onClick={() => handleDelete(product.id)}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Supplier *</label>
                  <input
                    type="text"
                    required
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>
              </div>

              {!editMode && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Unit Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.unitPrice}
                        onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Initial Quantity *</label>
                      <input
                        type="number"
                        required
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Min Stock Threshold</label>
                    <input
                      type="number"
                      value={formData.minStockThreshold}
                      onChange={(e) => setFormData({ ...formData, minStockThreshold: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editMode ? 'Update' : 'Create'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
