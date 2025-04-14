'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '@/types/auth'; // Assuming User type is defined here

// Define the shape of the context data
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean; // Add loading state for initial check
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context with a default value (can be undefined or null initially)
// Using 'null!' assertion as the provider will always supply a value.
const AuthContext = createContext<AuthContextType>(null!);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define the props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

// AbstractSnippet: AUTH_CTX001
// --- Authentication Context Provider ---
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Step 1: Initialize state for authentication status, user data, and loading
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading

  // Step 2: Check authentication status on initial load
  useEffect(() => {
    const checkInitialAuth = async () => {
      setIsLoading(true);
      try {
        // Step 2a: Call the user API endpoint
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const data: { success: boolean; user: User } = await response.json();
          // Step 2b: Update state if user is found
          if (data.success && data.user) {
            setIsAuthenticated(true);
            setUser(data.user);
          } else {
            // Step 2c: Ensure state is cleared if response is ok but no user
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          // Step 2d: Assume not authenticated if API call fails (e.g., 401)
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        // Step 2e: Handle fetch errors, assume not authenticated
        console.error('AuthContext: Failed to fetch initial auth status:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        // Step 2f: Set loading to false after check completes
        setIsLoading(false);
      }
    };
    checkInitialAuth();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Step 3: Define the login function to update state
  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    setIsLoading(false); // Ensure loading is false after login action
  };

  // Step 4: Define the logout function to clear state
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false); // Ensure loading is false after logout action
    // Note: API call to clear cookie happens separately in the component triggering logout
  };

  // Step 5: Provide the state and functions through the context
  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
