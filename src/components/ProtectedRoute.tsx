// components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  redirectTo = "/login",
  fallback,
}: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push(redirectTo);
      return;
    }

    if (requireAdmin && !isAdmin) {
      router.push("/unauthorized");
      return;
    }

    setShouldRender(true);
  }, [user, loading, isAdmin, requireAdmin, router, redirectTo]);

  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      )
    );
  }

  if (!shouldRender) {
    return fallback || null;
  }

  return <>{children}</>;
};

// HOC version untuk component wrapping
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options: { requireAdmin?: boolean; redirectTo?: string } = {}
) => {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Hook untuk conditional rendering
export const useRequireAuth = (requireAdmin = false) => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (requireAdmin && !isAdmin) {
      router.push("/unauthorized");
      return;
    }
  }, [user, loading, isAdmin, requireAdmin, router]);

  return {
    isAuthenticated: !!user,
    isAuthorized: requireAdmin ? isAdmin : !!user,
    loading,
  };
};

export default ProtectedRoute;
