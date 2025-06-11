// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type UserRole = "user" | "admin";

interface UserWithRole extends User {
  role?: UserRole;
}

interface AuthContextType {
  user: UserWithRole | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: any; user?: UserWithRole }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  isAdmin: false,
  refreshUserRole: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper function untuk fetch user role dengan error handling yang lebih baik
const fetchUserRole = async (userId: string): Promise<UserRole> => {
  try {
    // Pastikan userId valid
    if (!userId) {
      console.warn("fetchUserRole: userId is empty or null");
      return "user";
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      // Log error dengan detail yang lebih baik
      console.error("Error fetching user role:", {
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        userId: userId,
      });

      // Jika tabel tidak ada atau ada masalah dengan schema
      if (
        error.code === "PGRST116" ||
        error.message.includes("relation") ||
        error.message.includes("does not exist")
      ) {
        console.warn(
          "user_roles table might not exist. Creating default user role."
        );
        return "user";
      }

      return "user"; // default role untuk error lainnya
    }

    // Jika data null atau tidak memiliki role, kembalikan 'user'
    const role = data?.role as UserRole;
    return role || "user";
  } catch (error) {
    console.error("Unexpected error in fetchUserRole:", {
      error: error instanceof Error ? error.message : String(error),
      userId: userId,
    });
    return "user";
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserRole = async () => {
    if (user?.id) {
      const role = await fetchUserRole(user.id);
      setUser((prev) => (prev ? { ...prev, role } : null));
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          const role = await fetchUserRole(session.user.id);
          setUser({ ...session.user, role });
        } else if (mounted) {
          setUser(null);
        }
      } catch (error) {
        console.error("Unexpected error in getSession:", error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      try {
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          setUser({ ...session.user, role });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error in auth state change handler:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        return { error };
      }

      if (data.user) {
        const role = await fetchUserRole(data.user.id);
        const userWithRole = { ...data.user, role };
        setUser(userWithRole);
        return { error: null, user: userWithRole };
      }

      return { error: null };
    } catch (error) {
      console.error("Unexpected error in signIn:", error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Sign up error:", error);
      }

      return { error };
    } catch (error) {
      console.error("Unexpected error in signUp:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
      }
      setUser(null);
    } catch (error) {
      console.error("Unexpected error in signOut:", error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin: user?.role === "admin",
        refreshUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
