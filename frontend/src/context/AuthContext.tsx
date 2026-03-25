import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage: string | null;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.REACT_APP_API_URL || 'https://rasberry-production.up.railway.app';
const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

// Helper functions for token storage
const getStoredToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !expiry) return null;

  // Check if token is expired
  if (Date.now() > parseInt(expiry, 10)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }

  return token;
};

const setStoredToken = (token: string, expiresIn: number): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + expiresIn * 1000));
};

const clearStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

// Export token getter for API calls
export const getAuthToken = (): string | null => getStoredToken();

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        clearStoredToken();
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check for OAuth callback token on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const expiresIn = params.get('expiresIn');

    if (token && expiresIn) {
      setStoredToken(token, parseInt(expiresIn, 10));
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_URL}/auth/google`;
  };

  const logout = async () => {
    const token = getStoredToken();
    if (token) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    clearStoredToken();
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
