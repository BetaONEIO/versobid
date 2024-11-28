import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'buyer' | 'seller' | 'admin';
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, initialized } = useAuthStore();
  
  if (!initialized) return null;
  
  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (role && user.user_metadata?.role !== role) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}