import React, { useState, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import { employeeAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { formatCurrency, formatDate } from '../../utils/helpers';

const Reports = () => {
  const MINIMUM_REORDER_QUANTITY = 10;
  const [summary, setSummary] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  });

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
      <p className="subtitle">Historical data analysis and detailed insights</p>

      <div className="filters-container" style={{ marginBottom: '2rem' }}>
        <h3><FiFilter /> Report Date Range</h3>
        <div className="filters-grid">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
        </div>
        <p className="subtitle" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
          Showing data from {dateRange.startDate} to {dateRange.endDate}
        </p>
      </div>

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
          <h2>Complete Low Stock Analysis</h2>
          <p className="subtitle">All products below minimum stock threshold</p>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Min Threshold</th>
                  <th>Deficit</th>
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
                    <td className="text-red">{product.minStockThreshold - product.quantity}</td>
                    <td>{Math.max(product.minStockThreshold - product.quantity, MINIMUM_REORDER_QUANTITY)}</td>
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
