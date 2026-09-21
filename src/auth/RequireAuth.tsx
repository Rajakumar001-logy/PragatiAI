import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from '@/components/ui';
import { useAuth } from './AuthProvider';

export const RequireAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState message="Connecting to Pragati AI Command Center..." className="min-h-screen" />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
