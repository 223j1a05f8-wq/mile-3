import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/helpers';

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [summaryRes, lowStockRes] = await Promise.all([
        employeeAPI.getInventorySummary(),
        employeeAPI.getLowStockProducts()
      ]);
      setSummary(summaryRes.data);
      setLowStockProducts(lowStockRes.data);
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  return (
    <div className="reports">
      <h1>Reports</h1>
      <p className="subtitle">Inventory summary and insights</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{summary?.totalProducts || 0}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <h3>{summary?.totalQuantity || 0}</h3>
          <p>Total Stock</p>
        </div>
        <div className="stat-card">
          <h3>{formatCurrency(summary?.totalValue || 0)}</h3>
          <p>Total Value</p>
        </div>
        <div className="stat-card">
          <h3>{summary?.lowStockItems || 0}</h3>
          <p>Low Stock Items</p>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="report-table">
          <h2>Low Stock Products</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Min Threshold</th>
                  <th>Reorder Qty</th>
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
                    <td>{product.minStockThreshold - product.quantity}</td>
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

export default Reports;
