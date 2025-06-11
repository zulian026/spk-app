// components/AdminHeader.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

interface AdminHeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const AdminHeader = ({ setSidebarOpen }: AdminHeaderProps) => {
  const { user } = useAuth();
  const pathname = usePathname();

  // Get page title from pathname
  const getPageTitle = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || 'dashboard';
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button & title */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="ml-3 text-xl font-semibold text-gray-900">
            {getPageTitle(pathname)}
          </h1>
        </div>

        {/* Header actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {user?.email?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;