```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, initialized } = useAuthStore();
  
  if (!initialized) return null;
  
  if (!user) {
    return <Navigate to="/auth" />;
  }

  const userRole = user.user_metadata?.role || 'buyer';
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
```