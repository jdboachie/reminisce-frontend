"use client";

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginForm from './LoginForm';

interface AuthCheckProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children, requireAuth = false }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Temporarily disable auth requirement for testing
  // if (requireAuth && !isAuthenticated) {
  //   return <LoginForm />;
  // }

  return <>{children}</>;
};

export default AuthCheck;
