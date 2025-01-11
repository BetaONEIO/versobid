import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../contexts/UserContext';
import { validateEmail, validateUsername, validatePassword } from '../utils/validation';

interface FormData {
  identifier: string;
  password: string;
}

interface FormErrors {
  identifier: string | null;
  password: string | null;
}

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { auth } = useUser();
  const [formData, setFormData] = useState<FormData>({
    identifier: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    identifier: null,
    password: null,
  });

  useEffect(() => {
    // After successful login, redirect to intended route or last visited route
    if (auth.isAuthenticated) {
      const intendedRoute = localStorage.getItem('intendedRoute');
      const lastRoute = localStorage.getItem('lastRoute');
      
      if (intendedRoute) {
        localStorage.removeItem('intendedRoute');
        navigate(intendedRoute);
      } else if (lastRoute && lastRoute !== '/signin') {
        navigate(lastRoute);
      } else {
        navigate('/');
      }
    }
  }, [auth.isAuthenticated, navigate]);

  const validateIdentifier = (value: string): string | null => {
    if (value.includes('@')) {
      return validateEmail(value);
    }
    return validateUsername(value);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    setFormErrors(prev => ({
      ...prev,
      [field]: field === 'identifier' ? validateIdentifier(value) : validatePassword(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {
      identifier: validateIdentifier(formData.identifier),
      password: validatePassword(formData.password)
    };

    setFormErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== null)) {
      return;
    }

    try {
      await login(formData.identifier, formData.password);
    } catch (error) {
      // Error handling is done in useAuth hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email or Username
            </label>
            <input
              type="text"
              value={formData.identifier}
              onChange={(e) => handleChange('identifier', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {formErrors.identifier && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.identifier}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};