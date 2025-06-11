// components/AdminDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  X,
  Home,
  Users,
  Settings,
  BarChart3,
  FileText,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Shield,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isClient, setIsClient] = useState(false);

  // Ensure this only runs on client side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: Home, href: "/admin" },
    { id: "users", name: "Users", icon: Users, href: "/admin/users" },
    {
      id: "analytics",
      name: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
    },
    { id: "content", name: "Content", icon: FileText, href: "/admin/content" },
    {
      id: "settings",
      name: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
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
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeMenu === item.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="ml-3 text-xl font-semibold text-gray-900 capitalize">
                {activeMenu}
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
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                <Bell className="h-5 w-5" />
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

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard content based on active menu */}
            {activeMenu === "dashboard" && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Dashboard Overview
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Welcome back! Here's what's happening.
                  </p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    {
                      title: "Total Users",
                      value: "1,234",
                      change: "+12%",
                      color: "blue",
                    },
                    {
                      title: "Active Sessions",
                      value: "89",
                      change: "+5%",
                      color: "green",
                    },
                    {
                      title: "Revenue",
                      value: "$12,345",
                      change: "+8%",
                      color: "purple",
                    },
                    {
                      title: "Support Tickets",
                      value: "23",
                      change: "-3%",
                      color: "red",
                    },
                  ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            stat.change.startsWith("+")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent activity */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      Recent Activity
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {[
                        "New user registered: john@example.com",
                        "System backup completed successfully",
                        "New support ticket created",
                        "User data exported",
                        "Security scan completed",
                      ].map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">{activity}</span>
                          <span className="text-sm text-gray-500 ml-auto">
                            {index + 1}h ago
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other menu content placeholders */}
            {activeMenu !== "dashboard" && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 capitalize mb-4">
                  {activeMenu} Section
                </h2>
                <p className="text-gray-600">
                  This is the {activeMenu} section. Content for this section
                  will be implemented here.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
