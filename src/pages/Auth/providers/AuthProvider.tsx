import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { AuthFormData } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  isLogin: boolean;
  loading: boolean;
  formData: AuthFormData;
  setIsLogin: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.error(isLogin ? 'Invalid credentials' : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AuthContext.Provider value={{
      isLogin,
      loading,
      formData,
      setIsLogin,
      handleSubmit,
      handleChange
    }}>
      {children}
    </AuthContext.Provider>
  );
};