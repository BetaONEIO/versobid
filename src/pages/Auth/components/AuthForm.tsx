import React from 'react';
import { Loader2 } from 'lucide-react';
import { AuthFormData } from '../types';

interface AuthFormProps {
  isLogin: boolean;
  loading: boolean;
  formData: AuthFormData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AuthForm({ isLogin, loading, formData, onSubmit, onChange }: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              value={formData.name}
              onChange={onChange}
              required={!isLogin}
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              value={formData.username}
              onChange={onChange}
              required={!isLogin}
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          value={formData.email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          value={formData.password}
          onChange={onChange}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-indigo-600 py-3 px-4 rounded-lg font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="animate-spin h-5 w-5 mx-auto" />
        ) : (
          isLogin ? 'Sign In' : 'Create Account'
        )}
      </button>
    </form>
  );
}