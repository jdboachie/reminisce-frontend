"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return default values instead of throwing error
    return {
      isAuthenticated: false,
      accessToken: null,
      login: () => {},
      logout: () => {},
      isLoading: false
    };
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('accessToken', token);
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
