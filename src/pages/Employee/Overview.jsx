import React, { useState, useEffect } from 'react';
import { FiPackage, FiDollarSign, FiAlertTriangle, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { employeeAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { formatCurrency, formatDate } from '../../utils/helpers';

const Overview = () => {
  const [summary, setSummary] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [todayStats, setTodayStats] = useState({ count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [summaryRes, lowStockRes, transactionsRes] = await Promise.all([
        employeeAPI.getInventorySummary(),
        employeeAPI.getLowStockProducts(),
        employeeAPI.getTransactions({})
      ]);
      setSummary(summaryRes.data);
      setLowStockProducts(lowStockRes.data.slice(0, 5));
      
      // Get recent transactions
      const allTransactions = transactionsRes.data;
      setRecentTransactions(allTransactions.slice(0, 5));
      
      // Calculate today's transactions
      const todayTransactions = allTransactions.filter(t => {
        const transactionDate = new Date(t.transactionDate).toISOString().split('T')[0];
        return transactionDate === today;
      });
      setTodayStats({ count: todayTransactions.length });
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
      <h1>Employee Dashboard</h1>
      <p className="subtitle">Quick overview and recent activity</p>

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

      <div className="activity-section" style={{ marginTop: '30px' }}>
        <div className="stat-card" style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="stat-icon" style={{ backgroundColor: '#4CAF50' }}>
              <FiActivity />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '32px', color: '#4CAF50' }}>{todayStats.count}</h2>
              <p style={{ margin: 0, color: '#666' }}>Transactions Today</p>
            </div>
          </div>
        </div>
      </div>

      {recentTransactions.length > 0 && (
        <div className="recent-activity" style={{ marginTop: '30px' }}>
          <h2>Recent Activity</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.transactionDate)}</td>
                    <td>{transaction.productName}</td>
                    <td>
                      <span className={`type-badge ${transaction.transactionType.toLowerCase().replace('_', '-')}`}>
                        {transaction.transactionType.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{transaction.quantity}</td>
                    <td>
                      <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓ Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
