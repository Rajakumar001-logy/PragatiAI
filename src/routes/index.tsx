import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { Login } from '@/pages/Login';
import { GovernmentDashboard } from '@/pages/GovernmentDashboard';
import { StartupPortal } from '@/pages/StartupPortal';
import { ExpertReview } from '@/pages/ExpertReview';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { DiscoverStartups } from '@/pages/DiscoverStartups';
import { Challenges } from '@/pages/Challenges';
import { Applications } from '@/pages/Applications';
import { Evaluations } from '@/pages/Evaluations';
import { Pilots } from '@/pages/Pilots';
import { KPIs } from '@/pages/KPIs';
import { Payments } from '@/pages/Payments';
import { Validation } from '@/pages/Validation';
import { ScaleUp } from '@/pages/ScaleUp';
import { Settings } from '@/pages/Settings';
import { RequireAuth } from '@/auth/RequireAuth';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/government" replace />,
      },
      {
        path: 'government',
        element: <GovernmentDashboard />,
      },
      {
        path: 'startup',
        element: <StartupPortal />,
      },
      {
        path: 'expert',
        element: <ExpertReview />,
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: 'discover-startups',
        element: <DiscoverStartups />,
      },
      {
        path: 'challenges',
        element: <Challenges />,
      },
      {
        path: 'applications',
        element: <Applications />,
      },
      {
        path: 'evaluations',
        element: <Evaluations />,
      },
      {
        path: 'pilots',
        element: <Pilots />,
      },
      {
        path: 'kpis',
        element: <KPIs />,
      },
      {
        path: 'payments',
        element: <Payments />,
      },
      {
        path: 'validation',
        element: <Validation />,
      },
      {
        path: 'scale-up',
        element: <ScaleUp />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
