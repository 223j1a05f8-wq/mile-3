import React, { useState, useEffect } from 'react';
import { FiDownload, FiCalendar } from 'react-icons/fi';
import { employeeAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [summaryRes, lowStockRes, transactionsRes] = await Promise.all([
        employeeAPI.getInventorySummary(),
        employeeAPI.getLowStockProducts(),
        employeeAPI.getTransactions({})
      ]);
      setSummary(summaryRes.data);
      setLowStockProducts(lowStockRes.data);
      setTransactions(transactionsRes.data.slice(0, 10)); // Get last 10 transactions
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyDateFilter = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      toast.warning('Please select both start and end dates');
      return;
    }
    
    try {
      const response = await employeeAPI.getTransactions(dateRange);
      setTransactions(response.data.slice(0, 10));
      toast.success('Date filter applied');
    } catch (error) {
      toast.error('Failed to filter transactions');
    }
  };

  const handleExportReport = () => {
    // Simple CSV export
    const csvData = [
      ['Product Report'],
      ['Generated on:', new Date().toLocaleDateString()],
      [''],
      ['Summary'],
      ['Total Products', summary?.totalProducts || 0],
      ['Total Stock', summary?.totalQuantity || 0],
      ['Total Value', summary?.totalValue || 0],
      ['Low Stock Items', summary?.lowStockItems || 0],
      [''],
      ['Recent Transactions'],
      ['Date', 'SKU', 'Product', 'Type', 'Quantity', 'Before', 'After']
    ];
    
    transactions.forEach(t => {
      csvData.push([
        formatDate(t.transactionDate),
        t.sku,
        t.productName,
        t.transactionType,
        t.quantity,
        t.previousQuantity,
        t.newQuantity
      ]);
    });
    
    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  // Prepare data for chart
  const stockData = [
    { name: 'Total Products', value: summary?.totalProducts || 0 },
    { name: 'Low Stock Items', value: summary?.lowStockItems || 0 },
    { name: 'Normal Stock', value: Math.max(0, (summary?.totalProducts || 0) - (summary?.lowStockItems || 0)) }
  ];

  return (
    <div className="reports">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1>Detailed Reports & Analytics</h1>
          <p className="subtitle">Comprehensive inventory analysis with export capabilities</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleExportReport}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FiDownload /> Export Report
        </button>
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

      <div className="chart-card" style={{ marginBottom: '30px' }}>
        <h2>Stock Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0088FE" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="report-table">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Recent Transactions</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <FiCalendar />
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <span>to</span>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <button className="btn btn-secondary" onClick={handleApplyDateFilter}>
              Apply Filter
            </button>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>SKU</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Before</th>
                <th>After</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No recent transactions</td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.transactionDate)}</td>
                    <td>{transaction.sku}</td>
                    <td>{transaction.productName}</td>
                    <td>
                      <span className={`type-badge ${transaction.transactionType.toLowerCase().replace('_', '-')}`}>
                        {transaction.transactionType.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{transaction.quantity}</td>
                    <td>{transaction.previousQuantity}</td>
                    <td>{transaction.newQuantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
