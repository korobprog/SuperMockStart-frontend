import React, { useEffect } from 'react';
import { useTelegramAuth } from '../hooks/useTelegramAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { checkAuthStatus } = useTelegramAuth();

  useEffect(() => {
    // Run a single auth status check at app start
    checkAuthStatus();
  }, [checkAuthStatus]);

  return <>{children}</>;
};

export default AuthProvider;
