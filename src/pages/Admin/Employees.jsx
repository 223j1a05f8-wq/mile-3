import React, { useState, useEffect } from 'react';
import { FiMail, FiCalendar } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/helpers';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await adminAPI.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  return (
    <div className="employees">
      <h1>Employees</h1>
      <p className="subtitle">View employee information</p>

      <div className="employee-stats">
        <div className="stat-card">
          <h3>{employees.length}</h3>
          <p>Total Employees</p>
        </div>
        <div className="stat-card">
          <h3>{employees.filter(e => e.status === 'ACTIVE').length}</h3>
          <p>Active Employees</p>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.firstName} {employee.lastName}</td>
                <td>
                  <div className="email-cell">
                    <FiMail />
                    {employee.email}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${employee.status.toLowerCase()}`}>
                    {employee.status}
                  </span>
                </td>
                <td>
                  <div className="date-cell">
                    <FiCalendar />
                    {formatDate(employee.createdAt)}
                  </div>
                </td>
                <td>{formatDate(employee.lastLogin)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;
