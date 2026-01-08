import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

interface MainLayoutProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ isAuthenticated, isAdmin, onLogout }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={onLogout} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
