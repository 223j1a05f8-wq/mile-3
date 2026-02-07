import React, { useState, useEffect } from 'react';
import { FiPackage, FiDollarSign, FiAlertTriangle, FiTrendingUp } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/helpers';

const Overview = () => {
  const [summary, setSummary] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, lowStockRes] = await Promise.all([
        adminAPI.getInventorySummary(),
        adminAPI.getLowStockProducts()
      ]);
      setSummary(summaryRes.data);
      setLowStockProducts(lowStockRes.data.slice(0, 5));
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="overview">
      <h1>Admin Dashboard</h1>
      <p className="subtitle">Manage inventory and monitor stock levels</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FiPackage />
          </div>
          <div className="stat-info">
            <h3>{summary?.totalProducts || 0}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FiTrendingUp />
          </div>
          <div className="stat-info">
            <h3>{summary?.totalQuantity || 0}</h3>
            <p>Total Stock</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FiDollarSign />
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(summary?.totalValue || 0)}</h3>
            <p>Total Value</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <FiAlertTriangle />
          </div>
          <div className="stat-info">
            <h3>{summary?.lowStockItems || 0}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="low-stock-section">
          <h2>Low Stock Alert</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Min Threshold</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.sku}</td>
                    <td>{product.productName}</td>
                    <td>{product.category}</td>
                    <td className="text-red">{product.quantity}</td>
                    <td>{product.minStockThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
