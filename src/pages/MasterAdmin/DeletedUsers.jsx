import React, { useState, useEffect } from 'react';
import { FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { masterAdminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/helpers';

const DeletedUsers = () => {
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(null);

  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  const fetchDeletedUsers = async () => {
    setLoading(true);
    try {
      const response = await masterAdminAPI.getDeletedUsers();
      setDeletedUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch deleted users');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (userId, userEmail) => {
    if (window.confirm(`Are you sure you want to restore user "${userEmail}"?`)) {
      setRestoring(userId);
      try {
        await masterAdminAPI.restoreUser(userId);
        toast.success('User restored successfully');
        fetchDeletedUsers();
      } catch (error) {
        toast.error('Failed to restore user');
      } finally {
        setRestoring(null);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading deleted users...</div>;
  }

  return (
    <div className="deleted-users">
      <h1><FiTrash2 /> Deleted Users</h1>
      <p className="subtitle">View and restore deleted users</p>

      {deletedUsers.length === 0 ? (
        <div className="empty-state" style={{ 
          padding: '60px 20px', 
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          marginTop: '30px'
        }}>
          <FiTrash2 size={64} color="#ccc" />
          <h2 style={{ marginTop: '20px', color: '#666' }}>No Deleted Users</h2>
          <p style={{ color: '#999' }}>All users are active</p>
        </div>
      ) : (
        <div className="table-container" style={{ marginTop: '30px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Last Login</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {deletedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}</td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handleRestore(user.id, user.email)}
                      disabled={restoring === user.id}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        padding: '8px 16px'
                      }}
                    >
                      <FiRefreshCw />
                      {restoring === user.id ? 'Restoring...' : 'Restore'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeletedUsers;
