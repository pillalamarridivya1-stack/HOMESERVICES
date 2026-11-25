/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { BookingPage } from './pages/BookingPage';
import {
  AdminLoginPage,
  LoginPage,
  ServerLoginPage,
  SignupPage,
} from './pages/AuthPages';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ServerDashboard } from './pages/ServerDashboard';

const AppRouter: React.FC = () => {
  const { currentView, session } = useApp();

  if (currentView === 'admin-dashboard') {
    if (session?.role !== 'admin') return <AdminLoginPage />;
    return <AdminDashboard />;
  }

  if (currentView === 'server-dashboard') {
    if (session?.role !== 'server') return <ServerLoginPage />;
    return <ServerDashboard />;
  }

  if (currentView === 'user-dashboard') {
    if (session?.role !== 'user') return <LoginPage />;
    return <UserDashboard />;
  }

  if (currentView === 'booking') {
    if (session?.role !== 'user') return <LoginPage />;
    return <BookingPage />;
  }

  if (currentView === 'login') {
    if (session?.role === 'user') return <UserDashboard />;
    if (session?.role === 'admin') return <AdminDashboard />;
    if (session?.role === 'server') return <ServerDashboard />;
    return <LoginPage />;
  }

  if (currentView === 'signup') {
    if (session?.role === 'user') return <UserDashboard />;
    if (session?.role === 'admin') return <AdminDashboard />;
    if (session?.role === 'server') return <ServerDashboard />;
    return <SignupPage />;
  }

  if (currentView === 'admin-login') {
    if (session?.role === 'admin') return <AdminDashboard />;
    if (session?.role === 'user') return <UserDashboard />;
    if (session?.role === 'server') return <ServerDashboard />;
    return <AdminLoginPage />;
  }

  if (currentView === 'server-login') {
    if (session?.role === 'server') return <ServerDashboard />;
    if (session?.role === 'admin') return <AdminDashboard />;
    if (session?.role === 'user') return <UserDashboard />;
    return <ServerLoginPage />;
  }

  if (currentView === 'services') {
    return <ServicesPage />;
  }

  return <HomePage />;
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
