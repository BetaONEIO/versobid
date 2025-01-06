import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { RoleToggle } from '../ui/RoleToggle';
import { supabase } from '../../lib/supabase';
import { useNotification } from '../../contexts/NotificationContext';
import { NavLinks } from './navigation/NavLinks';

export const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { auth, role, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleLogout = async () => {
    try {
      // First call logout to clear the context
      logout();
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      addNotification('success', 'Successfully logged out');
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
      addNotification('error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              VersoBid
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {auth.isAuthenticated && (
              <NavLinks role={role} isAdmin={auth.user?.is_admin || false} />
            )}
            {!auth.isAuthenticated && (
              <Link
                to="/signin"
                state={{ from: location }}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Sign In
              </Link>
            )}
            {auth.isAuthenticated && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Log Out
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {auth.isAuthenticated && <RoleToggle />}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};