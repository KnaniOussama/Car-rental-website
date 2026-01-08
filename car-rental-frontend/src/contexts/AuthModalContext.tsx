import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterForm from '@/pages/Register';
import LoginForm from '@/pages/LoginForm'; // Assuming you've created this

interface AuthModalContextType {
  openAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

interface AuthModalProviderProps {
  children: ReactNode;
  onLoginSuccess: (isAdmin: boolean) => void;
}

export const AuthModalProvider: React.FC<AuthModalProviderProps> = ({ children, onLoginSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAuthModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = (isAdmin: boolean) => {
    onLoginSuccess(isAdmin);
    closeModal();
  };

  return (
    <AuthModalContext.Provider value={{ openAuthModal }}>
      {children}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onLoginSuccess={handleLogin} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onSuccess={closeModal} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </AuthModalContext.Provider>
  );
};
