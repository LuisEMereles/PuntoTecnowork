import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface AuthGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ allowedRoles, children }) => {
  const { session, profile, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  // No session, redirect to login
  if (!session && !profile) {
    // Check if we are in demo mode (no session but we want to show login)
    return <Navigate to="/login" replace />;
  }

  // If profile is loaded but role is not allowed
  if (profile && !allowedRoles.includes(profile.role)) {
    if (profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (profile.role === 'local') return <Navigate to="/local/dashboard" replace />;
    if (profile.role === 'client') return <Navigate to="/client/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};