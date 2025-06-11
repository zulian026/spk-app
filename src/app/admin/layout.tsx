// components/ProtectedAdminLayout.tsx
"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ReactNode, useState } from "react";

interface ProtectedAdminLayoutProps {
  children: ReactNode;
}

const ProtectedAdminLayout = ({ children }: ProtectedAdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute 
      requireAdmin={true}
      redirectTo="/login"
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin panel...</p>
          </div>
        </div>
      }
    >
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProtectedAdminLayout;