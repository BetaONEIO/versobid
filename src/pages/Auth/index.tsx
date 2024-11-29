import React from 'react';
import { AuthProvider } from './providers/AuthProvider';
import { AuthLayout } from './components/AuthLayout';
import { AuthContent } from './components/AuthContent';

const Auth = () => {
  return (
    <AuthProvider>
      <AuthLayout>
        <AuthContent />
      </AuthLayout>
    </AuthProvider>
  );
};

export default Auth;