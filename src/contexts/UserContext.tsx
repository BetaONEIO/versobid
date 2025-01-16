import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, AuthState, User } from '../types';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ExtendedSupabaseUser } from '../types/user';

interface UserContextType {
  role: UserRole;
  toggleRole: () => void;
  auth: AuthState;
  login: (user: User) => void;
  logout: () => void;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem('userRole');
      return (savedRole as UserRole) || 'buyer';
    } catch (error) {
      console.error('Failed to get role from localStorage:', error);
      return 'buyer';
    }
  });

  const [auth, setAuth] = useState<AuthState>(initialAuthState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateAuthState = (user: User | null) => {
    setAuth({
      isAuthenticated: !!user,
      user
    });
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session?.user && mounted) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile && mounted) {
            const supabaseUser = session.user as ExtendedSupabaseUser;
            updateAuthState({
              id: profile.id,
              name: profile.full_name,
              email: profile.email,
              username: profile.username,
              is_admin: profile.is_admin || false,
              email_verified: supabaseUser.email_verified || false
            });
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize auth');
        updateAuthState(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      try {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile) {
            const supabaseUser = session.user as ExtendedSupabaseUser;
            updateAuthState({
              id: profile.id,
              name: profile.full_name,
              email: profile.email,
              username: profile.username,
              is_admin: profile.is_admin || false,
              email_verified: supabaseUser.email_verified || false
            });
          }
        } else if (event === 'SIGNED_OUT') {
          updateAuthState(null);
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
        setError(error instanceof Error ? error.message : 'Failed to handle auth state change');
        updateAuthState(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const toggleRole = () => {
    try {
      const newRole = role === 'buyer' ? 'seller' : 'buyer';
      setRole(newRole);
      localStorage.setItem('userRole', newRole);
    } catch (error) {
      console.error('Failed to toggle role:', error);
      setError('Failed to toggle role');
    }
  };

  const login = (user: User) => {
    setError(null);
    updateAuthState(user);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      updateAuthState(null);
      setError(null);
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Failed to log out');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  const value = {
    role,
    toggleRole,
    auth,
    login,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}