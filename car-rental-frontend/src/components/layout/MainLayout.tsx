import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Chatbot from "../Chatbot";
import { Toaster } from "../ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface MainLayoutProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  isAuthenticated,
  isAdmin,
  onLogout,
}) => {
  return (
   <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <div className="flex flex-col min-h-screen">
      <Navbar
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLogout={onLogout}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Chatbot />
      <Toaster position="top-center"/>
    
    </div>
    </ThemeProvider>
  );
};

export default MainLayout;
