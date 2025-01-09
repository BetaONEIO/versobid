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

const UserContext = createContext<UserContextType | undefined>(undefined);

// Export the hook separately from the provider
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('buyer');
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const supabaseUser = session.user as ExtendedSupabaseUser;
            setAuth({
              isAuthenticated: true,
              user: {
                id: profile.id,
                name: profile.full_name,
                email: profile.email,
                username: profile.username,
                is_admin: profile.is_admin || false,
                email_verified: supabaseUser.email_verified || false
              }
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setAuth({ isAuthenticated: false, user: null });
        }
      } else if (event === 'SIGNED_OUT') {
        setAuth({ isAuthenticated: false, user: null });
      }
      setIsInitialized(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleRole = () => {
    setRole(role === 'buyer' ? 'seller' : 'buyer');
  };

  const login = (user: User) => {
    setAuth({
      isAuthenticated: true,
      user,
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuth({
      isAuthenticated: false,
      user: null,
    });
    navigate('/signin');
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <UserContext.Provider value={{ role, toggleRole, auth, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}