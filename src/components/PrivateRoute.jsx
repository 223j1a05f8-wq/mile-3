import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole, getDashboardRoute } from '../utils/helpers';

const PrivateRoute = ({ children, allowedRoles }) => {
  const isAuth = isAuthenticated();
  const userRole = getUserRole();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to user's appropriate dashboard
    return <Navigate to={getDashboardRoute(userRole)} replace />;
  }

  return children;
};

export default PrivateRoute;
