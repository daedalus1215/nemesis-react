import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import AuthGuard from '../../auth/AuthGuard';

export const ProtectedLayout: React.FC = () => {
  return (
    <AuthGuard>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
    </AuthGuard>
  );
}; 