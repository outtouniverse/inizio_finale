import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { identifier: string; password: string }) => Promise<void>;
  signup: (userData: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  initiateGoogleAuth: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Listen for OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if we're returning from OAuth (check for auth-related URL patterns)
      const currentPath = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);

      // Handle OAuth success/error redirects
      if (currentPath.includes('/auth') && (urlParams.has('success') || urlParams.has('error'))) {
        try {
          const authenticatedUser = await authService.handleOAuthCallback();
          if (authenticatedUser) {
            setUser(authenticatedUser);
            // Clean up URL and redirect to vault
            window.history.replaceState({}, document.title, '/vault');
            // Force navigation to vault
            window.location.href = '/vault';
          } else {
            console.error('OAuth callback: No authenticated user');
          }
        } catch (error) {
          console.error('OAuth callback failed:', error);
          // Redirect to auth page on error
          window.location.href = '/auth';
        }
      }
    };

    handleOAuthCallback();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticatedUser = await authService.checkAuth();
      setUser(authenticatedUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { identifier: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.data?.user || null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { username: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      await authService.signup(userData);
      // Note: User needs to verify email before being fully authenticated
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const initiateGoogleAuth = () => {
    authService.initiateGoogleAuth();
  };

  const refreshAuth = async () => {
    try {
      const authenticatedUser = await authService.checkAuth();
      setUser(authenticatedUser);
    } catch (error) {
      console.error('Auth refresh failed:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    initiateGoogleAuth,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
