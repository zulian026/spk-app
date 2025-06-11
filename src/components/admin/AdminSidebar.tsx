// components/AdminSidebar.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  X,
  Home,
  Users,
  Settings,
  BarChart3,
  FileText,
  LogOut,
  Shield,
  Laptop,
} from "lucide-react";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) => {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: Home, href: "/admin" },
    { id: "laptop", name: "Laptop", icon: Laptop, href: "/admin/laptops" },
    // {
    //   id: "analytics",
    //   name: "Analytics",
    //   icon: BarChart3,
    //   href: "/admin/analytics",
    // },
    // { id: "content", name: "Content", icon: FileText, href: "/admin/content" },
    // {
    //   id: "settings",
    //   name: "Settings",
    //   icon: Settings,
    //   href: "/admin/settings",
    // },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:inset-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">AdminPanel</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User info at bottom */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email || "Admin User"}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-3 w-full flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
