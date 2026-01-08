import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Car, LayoutDashboard, CalendarCheck, Users } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, label: 'Dashboard' },
    { to: '/bookings', icon: <CalendarCheck className="h-4 w-4" />, label: 'Bookings' },
    { to: '/users', icon: <Users className="h-4 w-4" />, label: 'Users' },
    { to: '/cars', icon: <Car className="h-4 w-4" />, label: 'Cars Management' },
  ];

  const SidebarContent = () => (
    <nav className="flex-1 px-4 py-6">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <aside className="hidden border-r bg-gray-100/40 md:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Car className="h-6 w-6" />
              <span>Car Admin</span>
            </Link>
          </div>
          <SidebarContent />
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-col">
        {/* Mobile Sidebar Toggle */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link to="/" className="flex items-center gap-2 font-semibold">
                <Car className="h-6 w-6" />
                <span>Car Admin</span>
              </Link>
            </div>
            <SidebarContent />
          </SheetContent>
        </Sheet>
        {/* Page content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet /> {/* Render nested routes here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;