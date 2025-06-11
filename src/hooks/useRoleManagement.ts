// hooks/useRoleManagement.ts
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export type UserRole = "user" | "admin";

interface RoleManagementState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

interface UserWithRole {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  role_created_at?: string;
}

export const useRoleManagement = () => {
  const { user, isAdmin, refreshUserRole } = useAuth();
  const [state, setState] = useState<RoleManagementState>({
    loading: false,
    error: null,
    success: null,
  });

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error, success: null }));
  };

  const setSuccess = (success: string | null) => {
    setState((prev) => ({ ...prev, success, error: null }));
  };

  const clearMessages = () => {
    setState((prev) => ({ ...prev, error: null, success: null }));
  };

  // Get all users with their roles
  const getAllUsers = useCallback(async (): Promise<UserWithRole[]> => {
    if (!isAdmin) {
      throw new Error("Admin access required");
    }

    try {
      const { data, error } = await supabase
        .from("user_roles_view")
        .select("*")
        .order("user_created_at", { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }

      return data.map((item) => ({
        id: item.id,
        email: item.email || "No email",
        role: item.role as UserRole,
        created_at: item.user_created_at,
        role_created_at: item.role_created_at,
      }));
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
    }
  }, [isAdmin]);

  // Update user role
  const updateUserRole = useCallback(
    async (userId: string, newRole: UserRole) => {
      if (!isAdmin) {
        throw new Error("Admin access required");
      }

      setLoading(true);
      clearMessages();

      try {
        const { error } = await supabase.from("user_roles").upsert({
          user_id: userId,
          role: newRole,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          throw new Error(`Failed to update role: ${error.message}`);
        }

        setSuccess(`Successfully updated user role to ${newRole}`);

        // Refresh current user's role if they updated their own role
        if (userId === user?.id) {
          await refreshUserRole();
        }

        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update role";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, isAdmin, refreshUserRole]
  );

  // Promote user to admin by email
  const promoteUserByEmail = useCallback(
    async (email: string) => {
      if (!isAdmin) {
        throw new Error("Admin access required");
      }

      setLoading(true);
      clearMessages();

      try {
        // Get user by email using the view
        const { data: userData, error: userError } = await supabase
          .from("user_roles_view")
          .select("id")
          .eq("email", email)
          .single();

        if (userError || !userData) {
          throw new Error(
            "User not found. Make sure they have signed up first."
          );
        }

        const success = await updateUserRole(userData.id, "admin");
        if (success) {
          setSuccess(`Successfully promoted ${email} to admin`);
        }

        return success;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to promote user";
        setError(errorMessage);
        return false;
      }
    },
    [isAdmin, updateUserRole]
  );

  // Make current user admin (for initial setup)
  const makeSelfAdmin = useCallback(async () => {
    if (!user?.id) {
      throw new Error("No user logged in");
    }

    setLoading(true);
    clearMessages();

    try {
      const { error } = await supabase.from("user_roles").upsert({
        user_id: user.id,
        role: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(`Failed to set admin role: ${error.message}`);
      }

      setSuccess("Successfully promoted yourself to admin");
      await refreshUserRole();
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to become admin";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.id, refreshUserRole]);

  // Remove admin role (demote to user)
  const demoteUser = useCallback(
    async (userId: string) => {
      return updateUserRole(userId, "user");
    },
    [updateUserRole]
  );

  // Check if specific user is admin
  const checkUserRole = useCallback(
    async (userId: string): Promise<UserRole> => {
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) {
          console.error("Error checking user role:", error);
          return "user";
        }

        return (data?.role as UserRole) || "user";
      } catch (error) {
        console.error("Error checking user role:", error);
        return "user";
      }
    },
    []
  );

  // Get user role by email
  const getUserRoleByEmail = useCallback(
    async (email: string): Promise<UserRole> => {
      try {
        const { data, error } = await supabase
          .from("user_roles_view")
          .select("role")
          .eq("email", email)
          .single();

        if (error) {
          console.error("Error getting user role by email:", error);
          return "user";
        }

        return (data?.role as UserRole) || "user";
      } catch (error) {
        console.error("Error getting user role by email:", error);
        return "user";
      }
    },
    []
  );

  // Bulk operations
  const promoteMultipleUsers = useCallback(
    async (userIds: string[]) => {
      if (!isAdmin) {
        throw new Error("Admin access required");
      }

      setLoading(true);
      clearMessages();

      try {
        const promises = userIds.map((userId) =>
          supabase.from("user_roles").upsert({
            user_id: userId,
            role: "admin",
            updated_at: new Date().toISOString(),
          })
        );

        const results = await Promise.allSettled(promises);
        const failed = results.filter(
          (result) => result.status === "rejected"
        ).length;
        const succeeded = results.length - failed;

        if (failed > 0) {
          setError(`${succeeded} users promoted, ${failed} failed`);
        } else {
          setSuccess(`Successfully promoted ${succeeded} users to admin`);
        }

        return succeeded;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Bulk promotion failed";
        setError(errorMessage);
        return 0;
      } finally {
        setLoading(false);
      }
    },
    [isAdmin]
  );

  return {
    // State
    loading: state.loading,
    error: state.error,
    success: state.success,

    // Actions
    getAllUsers,
    updateUserRole,
    promoteUserByEmail,
    makeSelfAdmin,
    demoteUser,
    checkUserRole,
    getUserRoleByEmail,
    promoteMultipleUsers,
    clearMessages,

    // Utilities
    canManageRoles: isAdmin,
    currentUser: user,
    isCurrentUserAdmin: isAdmin,
  };
};
