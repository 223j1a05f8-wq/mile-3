import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import MasterAdminDashboard from './pages/MasterAdmin/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';
import EmployeeDashboard from './pages/Employee/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { isAuthenticated, getDashboardRoute, getUserRole } from './utils/helpers';
import './App.css';

function App() {
  const isAuth = isAuthenticated();
  const userRole = getUserRole();

  return (
    <Router>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        
        <Routes>
          <Route 
            path="/" 
            element={
              isAuth ? (
                <Navigate to={getDashboardRoute(userRole)} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route
            path="/master-admin/*"
            element={
              <PrivateRoute allowedRoles={['MASTER_ADMIN']}>
                <MasterAdminDashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/employee/*"
            element={
              <PrivateRoute allowedRoles={['EMPLOYEE']}>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
