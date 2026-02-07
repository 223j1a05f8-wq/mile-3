import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiUsers, FiHome, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { getUser, logout } from '../../utils/helpers';
import UserManagement from './UserManagement';
import Overview from './Overview';
import './Dashboard.css';

const MasterAdminDashboard = () => {
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
    { path: '/master-admin', icon: <FiHome />, label: 'Overview', exact: true },
    { path: '/master-admin/users', icon: <FiUsers />, label: 'User Management' },
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
              <span className="role-badge master-admin">Master Admin</span>
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
                  : location.pathname.startsWith(item.path) ? 'active' : ''
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
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default MasterAdminDashboard;
