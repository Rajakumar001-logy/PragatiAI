import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mockData';

export interface SignUpData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  departmentOrCompany: string;
  designation?: string;
  phone?: string;
}

interface AuthContextValue {
  user: User | null;
  role: UserRole;
  loading: boolean;
  signIn: (email: string, password?: string, roleOverride?: UserRole) => Promise<User>;
  signUp: (data: SignUpData) => Promise<User>;
  loginAsRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_USER_KEY = 'pragati_ai_auth_user';
const CUSTOM_USERS_KEY = 'pragati_ai_registered_users';

function getStoredCustomUsers(): User[] {
  try {
    const saved = localStorage.getItem(CUSTOM_USERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to parse registered users', e);
  }
  return [];
}

function saveCustomUser(newUser: User) {
  try {
    const existing = getStoredCustomUsers();
    const updated = [newUser, ...existing.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase())];
    localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save registered user', e);
  }
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved auth user', e);
    }
    // Default to mock Government officer for seamless experience if session was active
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

  const signIn = useCallback(async (email: string, _password?: string, roleOverride?: UserRole): Promise<User> => {
    setLoading(true);
    const customUsers = getStoredCustomUsers();
    const allUsers = [...customUsers, ...mockUsers];

    // Find matching user by email
    let matched = allUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!matched) {
      // If user typed custom email with a role selected or guessed
      const assignedRole: UserRole =
        roleOverride ||
        (email.includes('startup') || email.includes('ecoroute') || email.includes('tech')
          ? 'startup'
          : email.includes('expert') || email.includes('iit') || email.includes('dr')
          ? 'expert'
          : email.includes('admin')
          ? 'admin'
          : 'government');

      const derivedName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Officer';
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: derivedName,
        email: email.trim(),
        role: assignedRole,
        departmentOrCompany:
          assignedRole === 'government'
            ? 'Department of Public Innovation'
            : assignedRole === 'startup'
            ? 'Pioneering Innovations Pvt Ltd'
            : assignedRole === 'expert'
            ? 'Technical Evaluation Committee'
            : 'Pragati AI Governance Authority',
        verified: true,
        designation: assignedRole === 'government' ? 'Director / Procurement Officer' : 'Chief Technical Lead',
      };

      saveCustomUser(newUser);
      matched = newUser;
    } else if (roleOverride && matched.role !== roleOverride) {
      matched = { ...matched, role: roleOverride };
    }

    setUser(matched);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(matched));
    setLoading(false);
    return matched;
  }, []);

  const signUp = useCallback(async (data: SignUpData): Promise<User> => {
    setLoading(true);
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      role: data.role,
      departmentOrCompany: data.departmentOrCompany.trim(),
      designation: data.designation?.trim() || (data.role === 'government' ? 'Director / Innovation Lead' : 'Founder & CEO'),
      phone: data.phone?.trim() || '+91 98765 43210',
      verified: true,
    };

    saveCustomUser(newUser);
    setUser(newUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    setLoading(false);
    return newUser;
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
      signUp,
      loginAsRole,
      switchRole,
      signOut,
    }),
    [user, role, loading, signIn, signUp, loginAsRole, switchRole, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
