import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  // Not logged in at all → go to login
  if (!user) return <Navigate to="/login" replace />;

  // Page requires admin but user is not admin → go to map
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/map" replace />;

  // All good — render the page
  return children;
}