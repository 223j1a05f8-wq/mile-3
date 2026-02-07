import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/helpers';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [categoryReport, setCategoryReport] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [filteredLowStockProducts, setFilteredLowStockProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterLowStockProducts();
  }, [lowStockProducts, searchTerm]);

  const fetchReports = async () => {
    try {
      const [summaryRes, categoryRes, lowStockRes] = await Promise.all([
        adminAPI.getInventorySummary(),
        adminAPI.getCategoryWiseReport(),
        adminAPI.getLowStockProducts()
      ]);
      setSummary(summaryRes.data);
      setCategoryReport(categoryRes.data);
      setLowStockProducts(lowStockRes.data);
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const filterLowStockProducts = () => {
    if (searchTerm) {
      const filtered = lowStockProducts.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLowStockProducts(filtered);
    } else {
      setFilteredLowStockProducts(lowStockProducts);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  return (
    <div className="reports">
      <h1>Reports & Analytics</h1>
      <p className="subtitle">Inventory insights and analysis</p>

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

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Category-wise Stock Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryReport}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalQuantity" fill="#0088FE" name="Total Quantity" />
              <Bar dataKey="productCount" fill="#00C49F" name="Product Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Category-wise Value Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryReport}
                dataKey="totalValue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.category}: ${formatCurrency(entry.totalValue)}`}
              >
                {categoryReport.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="report-table">
        <h2>Category-wise Summary</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Products</th>
                <th>Total Quantity</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {categoryReport.map((cat, index) => (
                <tr key={index}>
                  <td>{cat.category}</td>
                  <td>{cat.productCount}</td>
                  <td>{cat.totalQuantity}</td>
                  <td>{formatCurrency(cat.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="report-table">
          <h2>Low Stock Products</h2>
          <div className="search-box" style={{ marginBottom: '1rem' }}>
            <FiSearch />
            <input
              type="text"
              placeholder="Search by product name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                {filteredLowStockProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      {searchTerm ? 'No products match your search' : 'No low stock products found'}
                    </td>
                  </tr>
                ) : (
                  filteredLowStockProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.sku}</td>
                      <td>{product.productName}</td>
                      <td>{product.category}</td>
                      <td className="text-red">{product.quantity}</td>
                      <td>{product.minStockThreshold}</td>
                      <td>{product.minStockThreshold - product.quantity}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
