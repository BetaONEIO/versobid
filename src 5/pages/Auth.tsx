import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Loader2, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username: '',
    roles: {
      buyer: false,
      seller: false
    },
    acceptedTerms: false
  });

  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();

  const validateUsername = (username: string) => {
    // Username should be 3-20 characters, alphanumeric, and can contain underscores
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin) {
      if (!formData.roles.buyer && !formData.roles.seller) {
        toast.error('Please select at least one role');
        return;
      }
      
      if (!formData.acceptedTerms) {
        toast.error('Please accept the terms and conditions');
        return;
      }

      if (!validateUsername(formData.username)) {
        toast.error('Username must be 3-20 characters long and can only contain letters, numbers, and underscores');
        return;
      }
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        const selectedRoles = Object.entries(formData.roles)
          .filter(([_, isSelected]) => isSelected)
          .map(([role]) => role);
        
        await signUp(formData.email, formData.password, {
          name: formData.name,
          username: formData.username.toLowerCase(),
          roles: selectedRoles
        });
        toast.success('Account created successfully!');
      }
      navigate('/');
    } catch (error: any) {
      if (error.message.includes('username')) {
        toast.error('Username already taken');
      } else {
        toast.error(isLogin ? 'Invalid credentials' : 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role: 'buyer' | 'seller') => {
    setFormData(prev => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: !prev.roles[role]
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full">
        {/* Theme Toggle Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8 transition-colors">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">
              <span className="text-blue-900 dark:text-blue-400">Verso</span>
              <span className="text-red-600 dark:text-red-400">Bid</span>
            </div>
            <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
              Where buyers set the price and sellers make it happen
            </p>
            <h2 className="mt-6 text-2xl font-bold text-center text-gray-900 dark:text-white">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 sm:text-sm"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 sm:text-sm"
                      placeholder="johndoe123"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      3-20 characters, letters, numbers, and underscores only
                    </p>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 sm:text-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 sm:text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      I want to...
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="buyer-role"
                          name="buyer-role"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={formData.roles.buyer}
                          onChange={() => handleRoleChange('buyer')}
                        />
                        <label htmlFor="buyer-role" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Buy Items
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="seller-role"
                          name="seller-role"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={formData.roles.seller}
                          onChange={() => handleRoleChange('seller')}
                        />
                        <label htmlFor="seller-role" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Sell Items
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={formData.acceptedTerms}
                          onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                        />
                      </div>
                      <div className="ml-2">
                        <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                          I agree to the{' '}
                          <Link to="/terms" className="text-indigo-600 hover:text-indigo-500" target="_blank">
                            Terms and Conditions
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500" target="_blank">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  isLogin ? 'Sign in' : 'Sign up'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}