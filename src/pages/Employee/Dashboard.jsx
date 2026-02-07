import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiTrendingUp, FiTrendingDown, FiList, FiBarChart2, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { getUser, logout } from '../../utils/helpers';
import Overview from './Overview';
import Products from './Products';
import StockManagement from './StockManagement';
import Transactions from './Transactions';
import Reports from './Reports';
import './Dashboard.css';

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const menuItems = [
    { path: '/employee', icon: <FiHome />, label: 'Overview', exact: true },
    { path: '/employee/products', icon: <FiPackage />, label: 'Products' },
    { path: '/employee/stock-in', icon: <FiTrendingUp />, label: 'Stock In' },
    { path: '/employee/stock-out', icon: <FiTrendingDown />, label: 'Stock Out' },
    { path: '/employee/transactions', icon: <FiList />, label: 'Transactions' },
    { path: '/employee/reports', icon: <FiBarChart2 />, label: 'Reports' },
  ];

  return (
    <div className="dashboard">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>IMS</h2>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          {sidebarOpen && (
            <div className="user-details">
              <h4>{user?.firstName} {user?.lastName}</h4>
              <span className="role-badge employee">Employee</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                item.exact
                  ? location.pathname === item.path ? 'active' : ''
                  : location.pathname.startsWith(item.path) && location.pathname !== '/employee' ? 'active' : ''
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stock-in" element={<StockManagement type="IN" />} />
          <Route path="/stock-out" element={<StockManagement type="OUT" />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
