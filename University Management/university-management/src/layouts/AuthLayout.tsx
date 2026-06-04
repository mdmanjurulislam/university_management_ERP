import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../modules/auth/context/AuthContext';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!isLoading && !hasChecked.current) {
      if (isAuthenticated) {
        logout();
      }
      hasChecked.current = true;
    }
  }, [isLoading, isAuthenticated, logout]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
