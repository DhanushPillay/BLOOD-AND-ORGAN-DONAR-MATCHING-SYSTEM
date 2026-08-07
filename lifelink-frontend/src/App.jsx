import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { SocketProvider } from './context/SocketContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import CompleteProfile from './pages/CompleteProfile';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import CallLogs from './pages/CallLogs';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import Chat from './pages/Chat';
import DashboardLayout from './components/layout/DashboardLayout';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/layout/PageTransition';

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/')[1] || 'root'}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><PublicOnlyRoute><Login /></PublicOnlyRoute></PageTransition>} />
        <Route path="/signup" element={<PageTransition><PublicOnlyRoute><SignUp /></PublicOnlyRoute></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <PageTransition><CompleteProfile /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition transitionKey="dashboard"><DashboardLayout /></PageTransition>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="search/:type" element={<SearchPage />} />
          <Route path="calls" element={<CallLogs />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<HelpCenter />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:userId" element={<Chat />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <LocationProvider>
              <AppRoutes />
            </LocationProvider>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
