import React, { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiUserX } from 'react-icons/fi';
import { masterAdminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Overview = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await masterAdminAPI.getUserSummary();
      setSummary(response.data);
    } catch (error) {
      toast.error('Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="overview">
      <h1>Master Admin Dashboard</h1>
      <p className="subtitle">Manage users and system access</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FiUsers />
          </div>
          <div className="stat-info">
            <h3>{summary?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FiUserCheck />
          </div>
          <div className="stat-info">
            <h3>{summary?.activeUsers || 0}</h3>
            <p>Active Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <FiUserX />
          </div>
          <div className="stat-info">
            <h3>{summary?.deletedUsers || 0}</h3>
            <p>Deleted Users</p>
          </div>
        </div>
      </div>

      <div className="role-breakdown">
        <h2>Users by Role</h2>
        <div className="role-cards">
          <div className="role-card">
            <h3>{summary?.masterAdmins || 0}</h3>
            <p>Master Admins</p>
          </div>
          <div className="role-card">
            <h3>{summary?.admins || 0}</h3>
            <p>Admins</p>
          </div>
          <div className="role-card">
            <h3>{summary?.employees || 0}</h3>
            <p>Employees</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
