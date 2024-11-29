import React from 'react';
import { useAuth } from '../providers/AuthProvider';

export const AuthFooter = () => {
  const { isLogin, setIsLogin } = useAuth();

  return (
    <div className="mt-6 text-center">
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-white/80 hover:text-white"
      >
        {isLogin
          ? "Don't have an account? Sign up"
          : 'Already have an account? Sign in'}
      </button>
    </div>
  );
};