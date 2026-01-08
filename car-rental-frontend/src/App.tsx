import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import CarManagementPage from "./pages/CarManagementPage";
import DashboardPage from "./pages/DashboardPage";
import PublicCarListingPage from "./pages/PublicCarListingPage";
import MainLayout from "./components/layout/MainLayout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const adminStatus = localStorage.getItem("isAdmin");
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAdmin");
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
      <Navigate to="/login" replace />
    );
  };
  return (
    <Router>
      <Routes>
        <Route
          element={
            <MainLayout
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              onLogout={handleLogout}
            />
          }
        >
          <Route path="/" element={<PublicCarListingPage />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to={isAdmin ? "/dashboard" : "/"} replace />
              ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* Admin Routes */}
          <Route element={<AdminRoutes />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cars" element={<CarManagementPage />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
