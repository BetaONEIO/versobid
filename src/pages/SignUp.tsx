import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthFormData } from '../types';
import { useNotification } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';
import { TermsModal } from '../components/ui/TermsModal';
import { PrivacyModal } from '../components/ui/PrivacyModal';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    username: '',
    name: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      addNotification('error', 'You must accept the Terms & Conditions and Privacy Policy');
      return;
    }

    try {
      setLoading(true);

      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', formData.email)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingUser) {
        addNotification('info', 'This email is already registered. Redirecting to sign in...');
        setTimeout(() => {
          navigate('/signin', { state: { email: formData.email } });
        }, 2000);
        return;
      }

      // Sign up with Supabase Auth with retry logic
      let signUpAttempts = 0;
      const maxAttempts = 3;
      let authData;
      let signUpError;

      while (signUpAttempts < maxAttempts) {
        try {
          const result = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                username: formData.username,
                full_name: formData.name
              },
              emailRedirectTo: `${window.location.origin}/auth/callback`
            }
          });

          if (result.error) throw result.error;
          authData = result.data;
          break;
        } catch (error) {
          signUpError = error;
          signUpAttempts++;
          if (signUpAttempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * signUpAttempts));
          }
        }
      }

      if (signUpError || !authData?.user) {
        throw signUpError || new Error('Failed to create user account');
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          email: formData.email,
          username: formData.username,
          full_name: formData.name,
          created_at: new Date().toISOString(),
          avatar_url: null,
          is_admin: false
        }]);

      if (profileError) {
        throw profileError;
      }

      addNotification('success', 'Account created successfully! Please check your email to verify your account.');
      navigate('/signin');
      
    } catch (error) {
      console.error('Signup error:', error);
      addNotification('error', error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              I agree to the{' '}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Terms & Conditions
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setShowPrivacy(true)}
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Privacy Policy
              </button>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};