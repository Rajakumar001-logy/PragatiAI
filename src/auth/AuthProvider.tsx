import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { User, UserRole } from '@/types';
import { mockService } from '@/services/mockService';
import { mockUsers } from '@/data/mockData';

interface AuthContextValue {
  user: User | null;
  role: UserRole;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<string | null>;
  loginAsRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_USER_KEY = 'pragati_ai_auth_user';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved auth user', e);
    }
    // Default to Government officer for instant demo experience
    return mockUsers[0];
  });

  const [loading, setLoading] = useState(false);

  const role: UserRole = user?.role || 'government';

  const loginAsRole = useCallback((newRole: UserRole) => {
    const selectedUser = mockUsers.find((u) => u.role === newRole) || mockUsers[0];
    setUser(selectedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(selectedUser));
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    loginAsRole(newRole);
  }, [loginAsRole]);

  const signIn = useCallback(async (email: string, _password?: string) => {
    setLoading(true);
    // Find matching user by email, or match role from email substring
    let matched = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!matched) {
      if (email.includes('startup') || email.includes('ecoroute')) matched = mockUsers[1];
      else if (email.includes('expert') || email.includes('iit')) matched = mockUsers[2];
      else if (email.includes('admin')) matched = mockUsers[3];
      else matched = mockUsers[0];
    }
    setUser(matched);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(matched));
    setLoading(false);
    return null;
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      loading,
      signIn,
      loginAsRole,
      switchRole,
      signOut,
    }),
    [user, role, loading, signIn, loginAsRole, switchRole, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
