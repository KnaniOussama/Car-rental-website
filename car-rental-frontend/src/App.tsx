import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import CarManagementPage from './pages/CarManagementPage';
import DashboardPage from './pages/DashboardPage';
import BookingsManagementPage from './pages/BookingsManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import PublicCarListingPage from './pages/PublicCarListingPage';
import MainLayout from './components/layout/MainLayout';
import BookingPage from './pages/BookingPage';
import { AuthModalProvider } from './contexts/AuthModalContext';
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const adminStatus = localStorage.getItem('isAdmin');
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(adminStatus ? JSON.parse(adminStatus) : false);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (isAdminResponse: boolean) => {
    setIsAuthenticated(true);
    setIsAdmin(isAdminResponse);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Component to protect admin routes
  const AdminRoutes = () => {
    return isAuthenticated && isAdmin ? (
      <DashboardLayout/>
    ) : (
      <Navigate to="/" replace />
    );
  };

  return (
    <AuthModalProvider onLoginSuccess={handleLoginSuccess}>
      <Router>
        <Routes>
          <Route element={<MainLayout isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogout} />}>
            <Route path="/" element={<PublicCarListingPage />} />
            <Route path="/book/:carId" element={<BookingPage isAuthenticated={isAuthenticated} />} />
            
            {/* Admin Routes */}
            <Route element={<AdminRoutes />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/bookings" element={<BookingsManagementPage />} />
              <Route path="/users" element={<UserManagementPage />} />
              <Route path="/cars" element={<CarManagementPage />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthModalProvider>
  );
}

export default App;
