import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import type { User } from "@supabase/supabase-js";

export type Role = {
  is_admin: boolean;
  is_moderator: boolean;
  is_worker?: boolean;
};

type PortfolioAuthContextType = {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
};

const PortfolioAuthContext = createContext<PortfolioAuthContextType | undefined>(undefined);

export function PortfolioAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserRole(session.user.id);
      } else {
        setRole(null);
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserRole(session.user.id);
      } else {
        setRole(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadUserRole(userId: string) {
    try {
      // First try to find by user_id
      let { data, error } = await supabase
        .from("roles")
        .select("*")
        .eq("user_id", userId)
        .single();

      // If not found by user_id, try by email as fallback
      if (error && user?.email) {
        const { data: emailData, error: emailError } = await supabase
          .from("roles")
          .select("*")
          .eq("email", user.email)
          .single();
        
        if (!emailError) {
          data = emailData;
          error = null;
        }
      }

      if (error) throw error;
      console.log("Role loaded:", data);
      setRole(data);
    } catch (error) {
      console.error("Error loading user role:", error);
      console.log("User ID:", userId, "User email:", user?.email);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PortfolioAuthContext.Provider 
      value={{ user, role, isLoading }}
    >
      {children}
    </PortfolioAuthContext.Provider>
  );
}

export function useUser() {
  const context = useContext(PortfolioAuthContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a PortfolioAuthProvider");
  }
  return context;
}