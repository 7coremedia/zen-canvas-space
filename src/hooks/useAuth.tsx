import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // --- Save pending brand data after sign-in ---
        if (event === "SIGNED_IN" && session?.user) {
          const pendingDataString = sessionStorage.getItem('pendingBrandData');
          if (pendingDataString) {
            try {
              const brandData = JSON.parse(pendingDataString);

              // Check how many brands the user already has.
              const { count, error: countError } = await supabase
                .from('brands')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', session.user.id);

              if (countError) throw countError;

              // If the user has no brands, this one becomes the primary.
              const isPrimary = count === 0;

              const { data: newBrand, error } = await supabase
                .from('brands')
                .insert({
                  ...brandData,
                  user_id: session.user.id,
                  is_primary: isPrimary,
                })
                .select()
                .single();

              if (error) throw error;

              sessionStorage.removeItem('pendingBrandData');
              toast({
                title: "Welcome!",
                description: `Your brand profile for "${newBrand.brand_name}" has been saved.`,
              });

            } catch (error: any) {
              console.error("Failed to save pending brand data:", error);
              toast({
                title: "Save Failed",
                description: "We couldn't save your onboarding data. Please contact support.",
                variant: "destructive",
              });
            }
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = React.useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    return { error };
  }, []);

  const signInWithEmail = React.useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }, []);

  const signUpWithEmail = React.useCallback(async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/brand-details`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  }, []);

  const signOut = React.useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  const value: AuthContextValue = { 
    session, 
    user, 
    loading, 
    signInWithGoogle, 
    signInWithEmail,
    signUpWithEmail,
    signOut 
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

