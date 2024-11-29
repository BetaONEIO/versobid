import React from 'react';
import { AuthHeader } from './AuthHeader';
import { AuthForm } from './AuthForm';
import { AuthFooter } from './AuthFooter';
import { useAuth } from '../providers/AuthProvider';

export const AuthContent = () => {
  const { isLogin } = useAuth();

  return (
    <>
      <AuthHeader
        title={isLogin ? 'Welcome Back' : 'Create Account'}
        subtitle={isLogin
          ? 'Sign in to continue to VersoBid'
          : 'Join VersoBid and start trading'
        }
      />
      <AuthForm />
      <AuthFooter />
    </>
  );
};