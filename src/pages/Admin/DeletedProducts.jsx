import React, { useState, useEffect } from 'react';
import { FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { formatCurrency, formatDate } from '../../utils/helpers';

const DeletedProducts = () => {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(null);

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  const fetchDeletedProducts = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDeletedProducts();
      setDeletedProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch deleted products');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to restore "${productName}"?`)) {
      setRestoring(productId);
      try {
        await adminAPI.restoreProduct(productId);
        toast.success('Product restored successfully');
        fetchDeletedProducts();
      } catch (error) {
        toast.error('Failed to restore product');
      } finally {
        setRestoring(null);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading deleted products...</div>;
  }

  return (
    <div className="deleted-products">
      <h1><FiTrash2 /> Deleted Products</h1>
      <p className="subtitle">View and restore deleted products</p>

      {deletedProducts.length === 0 ? (
        <div className="empty-state" style={{ 
          padding: '60px 20px', 
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          marginTop: '30px'
        }}>
          <FiTrash2 size={64} color="#ccc" />
          <h2 style={{ marginTop: '20px', color: '#666' }}>No Deleted Products</h2>
          <p style={{ color: '#999' }}>All products are active</p>
        </div>
      ) : (
        <div className="table-container" style={{ marginTop: '30px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Deleted At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {deletedProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.sku}</td>
                  <td>{product.productName}</td>
                  <td>{product.category}</td>
                  <td>{product.supplier}</td>
                  <td>{formatCurrency(product.unitPrice)}</td>
                  <td>{product.quantity}</td>
                  <td>{formatDate(product.updatedAt)}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handleRestore(product.id, product.productName)}
                      disabled={restoring === product.id}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        padding: '8px 16px'
                      }}
                    >
                      <FiRefreshCw />
                      {restoring === product.id ? 'Restoring...' : 'Restore'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeletedProducts;
