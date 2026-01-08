import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Car } from "lucide-react";

interface NavbarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  isAdmin,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <Car className="h-6 w-6" />
        <span className="text-lg">Car Rental</span>
      </Link>
      <div className="flex items-center gap-4">
        <ModeToggle />

        {isAuthenticated && isAdmin && (
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
        )}
        {isAuthenticated && <Button onClick={handleLogout}>Logout</Button>}
        {!isAuthenticated && (
          <Button onClick={() => navigate("/login")}>Login</Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
