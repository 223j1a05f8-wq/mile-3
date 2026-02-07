import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiTrendingUp, FiTrendingDown, FiBarChart2, FiUsers, FiLogOut, FiMenu, FiX, FiTrash2 } from 'react-icons/fi';
import { getUser, logout } from '../../utils/helpers';
import Overview from './Overview';
import ProductManagement from './ProductManagement';
import StockManagement from './StockManagement';
import Reports from './Reports';
import Employees from './Employees';
import DeletedProducts from './DeletedProducts';
import './Dashboard.css';

const AdminDashboard = () => {
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
    { path: '/admin', icon: <FiHome />, label: 'Overview', exact: true },
    { path: '/admin/products', icon: <FiPackage />, label: 'Products' },
    { path: '/admin/stock-in', icon: <FiTrendingUp />, label: 'Stock In' },
    { path: '/admin/stock-out', icon: <FiTrendingDown />, label: 'Stock Out' },
    { path: '/admin/reports', icon: <FiBarChart2 />, label: 'Reports' },
    { path: '/admin/employees', icon: <FiUsers />, label: 'Employees' },
    { path: '/admin/deleted-products', icon: <FiTrash2 />, label: 'Deleted Products' },
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
              <span className="role-badge admin">Admin</span>
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
                  : location.pathname.startsWith(item.path) && location.pathname !== '/admin' ? 'active' : ''
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
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/stock-in" element={<StockManagement type="IN" />} />
          <Route path="/stock-out" element={<StockManagement type="OUT" />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/deleted-products" element={<DeletedProducts />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
