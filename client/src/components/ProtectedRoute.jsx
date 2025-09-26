import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserAuth, selectIsAdmin } from '../store/authSlice.js';

export default function ProtectedRoute({ requireAdmin = false }) {
  const userAuth = useSelector(selectUserAuth);
  const isAdmin = useSelector(selectIsAdmin);

  if (!userAuth) return <Navigate to="/login" replace />;

  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
