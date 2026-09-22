import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mockData';

export interface PrototypeCredential {
  email: string;
  alternateEmail?: string;
  password: string;
  role: UserRole;
  name: string;
  departmentOrCompany: string;
  designation: string;
  roleLabel: string;
  targetDashboard: string;
}

export const AUTHORIZED_CREDENTIALS: PrototypeCredential[] = [
  {
    email: 'gov1123@gmail.com',
    password: 'Ironman@1',
    role: 'government',
    name: 'Dr. Rajesh Varma, IAS',
    departmentOrCompany: 'Ministry of Housing & Urban Affairs',
    designation: 'Joint Secretary (Smart Cities Mission)',
    roleLabel: 'Government Officer',
    targetDashboard: '/government',
  },
  {
    email: 'startup1123@gmail.com',
    password: 'Ironman@2',
    role: 'startup',
    name: 'Aanya Sharma',
    departmentOrCompany: 'EcoRoute Technologies Pvt Ltd',
    designation: 'Founder & CEO (DPIIT Recognized)',
    roleLabel: 'Startup Innovator',
    targetDashboard: '/startup',
  },
  {
    email: 'evaluater1123@3gmail.com',
    alternateEmail: 'evaluater1123@gmail.com',
    password: 'Ironman@3',
    role: 'expert',
    name: 'Prof. S. Ramanathan',
    departmentOrCompany: 'IIT Delhi & CSIR Review Committee',
    designation: 'Chairperson, Technical Review Panel',
    roleLabel: 'Technical Evaluator',
    targetDashboard: '/expert',
  },
  {
    email: 'administrator@gmail.com',
    password: 'Ironman@4',
    role: 'admin',
    name: 'Directorate General',
    departmentOrCompany: 'Pragati AI Platform Administration (MeitY)',
    designation: 'Chief Platform Administrator',
    roleLabel: 'Platform Administrator',
    targetDashboard: '/admin',
  },
];

interface AuthContextValue {
  user: User | null;
  role: UserRole;
  loading: boolean;
  signInWithCredentials: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string; targetDashboard?: string }>;
  loginAsRole: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  signOut: () => Promise<void>;
  authorizedCredentials: PrototypeCredential[];
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
    return null;
  });

  const [loading, setLoading] = useState(false);

  const role: UserRole = user?.role || 'government';

  const loginAsRole = useCallback((newRole: UserRole) => {
    const cred = AUTHORIZED_CREDENTIALS.find((c) => c.role === newRole) || AUTHORIZED_CREDENTIALS[0];
    const loggedUser: User = {
      id: `user-${cred.role}`,
      name: cred.name,
      email: cred.email,
      role: cred.role,
      departmentOrCompany: cred.departmentOrCompany,
      designation: cred.designation,
      verified: true,
    };
    setUser(loggedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loggedUser));
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    loginAsRole(newRole);
  }, [loginAsRole]);

  const signInWithCredentials = useCallback(
    async (
      inputEmail: string,
      inputPassword: string
    ): Promise<{ success: boolean; user?: User; error?: string; targetDashboard?: string }> => {
      setLoading(true);
      const cleanEmail = inputEmail.trim().toLowerCase();
      const cleanPassword = inputPassword.trim();

      // Find matching authorized credential
      const matched = AUTHORIZED_CREDENTIALS.find(
        (c) =>
          c.email.toLowerCase() === cleanEmail ||
          (c.alternateEmail && c.alternateEmail.toLowerCase() === cleanEmail)
      );

      if (!matched) {
        setLoading(false);
        return {
          success: false,
          error: `Access Denied: "${inputEmail}" is not authorized for portal access. Please verify your registered official email ID.`,
        };
      }

      if (matched.password !== cleanPassword) {
        setLoading(false);
        return {
          success: false,
          error: `Access Denied: Incorrect password for ${cleanEmail}. Please check your credentials and retry.`,
        };
      }

      const loggedUser: User = {
        id: `user-${matched.role}`,
        name: matched.name,
        email: matched.email,
        role: matched.role,
        departmentOrCompany: matched.departmentOrCompany,
        designation: matched.designation,
        verified: true,
      };

      setUser(loggedUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loggedUser));
      setLoading(false);

      return {
        success: true,
        user: loggedUser,
        targetDashboard: matched.targetDashboard,
      };
    },
    []
  );

  const signOut = useCallback(async () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      loading,
      signInWithCredentials,
      loginAsRole,
      switchRole,
      signOut,
      authorizedCredentials: AUTHORIZED_CREDENTIALS,
    }),
    [user, role, loading, signInWithCredentials, loginAsRole, switchRole, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
