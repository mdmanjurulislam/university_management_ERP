import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { User, AuthState } from '../types/auth.types';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { queryClient } from '../../../shared/utils/queryClient';

interface AuthContextType extends AuthState {
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const setLogoutTimer = (token: string) => {
    clearLogoutTimer();
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const timeLeft = (decoded.exp - currentTime) * 1000;

      if (timeLeft <= 0) {
        logout();
      } else {
        logoutTimerRef.current = setTimeout(() => {
          logout();
          toast.error('Session expired. Please log in again.');
        }, timeLeft);
      }
    } catch (error) {
      console.error('Error setting logout timer:', error);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const refreshToken = sessionStorage.getItem('refreshToken');
    const userJson = sessionStorage.getItem('user');
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        setState({
          token,
          refreshToken,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        setLogoutTimer(token);
      } catch (e) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }

    return () => clearLogoutTimer();
  }, []);

  const login = (token: string, refreshToken: string, user: User) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('refreshToken', refreshToken);
    sessionStorage.setItem('user', JSON.stringify(user));
    setState({
      token,
      refreshToken,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
    setLogoutTimer(token);
  };

  const logout = async () => {
    clearLogoutTimer();
    const data = await authService.logout();
    if (data?.message) {
      toast.success(data.message);
    }
    // Clear React Query client cache on logout
    queryClient.clear();
    setState({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
