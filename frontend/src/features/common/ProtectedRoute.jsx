import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../auth/authContext';

const ProtectedRoute = ({ allowedRoles = ['Employee', 'Manager'] }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="w-full h-full flex items-center justify-center"><div className="spinner" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = (user.role || '').toString().toLowerCase();
  const allowed = allowedRoles.map(r => r.toString().toLowerCase());


  if (!allowed.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
