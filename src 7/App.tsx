import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import {
  Auth,
  Marketplace,
  CreateItem,
  ItemDetails,
  Profile,
  Messages,
  ComingSoon
} from './pages';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthProvider from './components/auth/AuthProvider';
import { useAuthStore } from './stores/authStore';

// Check if we're on the main domain or test subdomain
const isMainDomain = window.location.hostname === 'versobid.com';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, initialized } = useAuthStore();
  
  if (!initialized) return null;
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

export default function App() {
  // Show coming soon page on main domain
  if (isMainDomain) {
    return (
      <ThemeProvider>
        <ComingSoon />
        <Toaster position="top-right" />
      </ThemeProvider>
    );
  }

  // Show full application on test subdomain
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Header />
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Marketplace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-item"
                  element={
                    <ProtectedRoute>
                      <CreateItem />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/item/:id"
                  element={
                    <ProtectedRoute>
                      <ItemDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:username"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages/:chatId"
                  element={
                    <ProtectedRoute>
                      <Messages />
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