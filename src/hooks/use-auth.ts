'use client';

import { useState, useEffect } from 'react';
import { User, AuthState } from '@/types/chat';
import { authenticateUser, registerUser, getCurrentUser, setCurrentUser, logout, updateUserStatus } from '@/lib/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for existing user session
    const user = getCurrentUser();
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
      // Update user status to online
      updateUserStatus(user.id, 'online');
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const user = await authenticateUser(email, password);
      
      if (user) {
        setCurrentUser(user);
        updateUserStatus(user.id, 'online');
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: 'Invalid email or password' };
      }
    } catch {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Authentication failed' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const user = await registerUser(name, email, password);
      
      if (user) {
        setCurrentUser(user);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: 'User already exists or invalid data' };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Registration failed' };
    }
  };

  const signOut = () => {
    if (authState.user) {
      updateUserStatus(authState.user.id, 'offline');
    }
    logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setCurrentUser(updatedUser);
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
    }
  };

  return {
    ...authState,
    login,
    register,
    signOut,
    updateUser
  };
};