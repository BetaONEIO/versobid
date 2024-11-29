import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import ComingSoonPage from './pages/ComingSoonPage';
import MarketplacePage from './pages/MarketplacePage';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthProvider from './components/auth/AuthProvider';
import { useAuthStore } from './stores/authStore';

const isMainDomain = window.location.hostname === "versobid.com";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, initialized } = useAuthStore();

  if (!initialized) return null;
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

export default function App() {
  if (isMainDomain) {
    return (
      <ThemeProvider>
        <ComingSoonPage />
        <Toaster position="top-right" />
      </ThemeProvider>
    );
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Header />
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MarketplacePage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Toaster position="top-right" />
            </div>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}