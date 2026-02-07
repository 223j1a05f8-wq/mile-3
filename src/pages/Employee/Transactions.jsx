import React, { useState, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import { employeeAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/helpers';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    sku: '',
    productName: '',
    transactionType: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getTransactions(filters);
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyFilters = () => {
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setFilters({
      sku: '',
      productName: '',
      transactionType: '',
      startDate: '',
      endDate: '',
    });
    setTimeout(() => fetchTransactions(), 100);
  };

  return (
    <div className="transactions">
      <h1>Stock Transactions</h1>
      <p className="subtitle">View and filter stock transaction history</p>

      <div className="filters-container">
        <h3><FiFilter /> Filters</h3>
        <div className="filters-grid">
          <div className="form-group">
            <label>SKU</label>
            <input
              type="text"
              name="sku"
              value={filters.sku}
              onChange={handleFilterChange}
              placeholder="Search by SKU"
            />
          </div>

          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={filters.productName}
              onChange={handleFilterChange}
              placeholder="Search by product name"
            />
          </div>

          <div className="form-group">
            <label>Transaction Type</label>
            <select
              name="transactionType"
              value={filters.transactionType}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="STOCK_IN">Stock In</option>
              <option value="STOCK_OUT">Stock Out</option>
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button className="btn btn-primary" onClick={handleApplyFilters}>
            Apply Filters
          </button>
          <button className="btn btn-secondary" onClick={handleResetFilters}>
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Before</th>
                <th>After</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">No transactions found</td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.transactionDate)}</td>
                    <td>{transaction.product?.sku}</td>
                    <td>{transaction.product?.productName}</td>
                    <td>
                      <span className={`type-badge ${transaction.transactionType.toLowerCase().replace('_', '-')}`}>
                        {transaction.transactionType.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{transaction.quantity}</td>
                    <td>{transaction.quantityBefore}</td>
                    <td>{transaction.quantityAfter}</td>
                    <td>{transaction.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
