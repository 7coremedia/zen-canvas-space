import * as React from "react";
import { supabase } from "@/lib/supabaseClient";

export type AuthContextValue = {
  session: any;
  user: any;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<any>(null);
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await (supabase as any).auth?.getSession?.();
        if (isMounted) {
          setSession(data?.session || null);
          setUser(data?.session?.user || null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    const { data: listener } = (supabase as any).auth?.onAuthStateChange?.((_event: any, s: any) => {
      setSession(s);
      setUser(s?.user || null);
    }) || { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      listener?.subscription?.unsubscribe?.();
      isMounted = false;
    };
  }, []);

  const signInWithGoogle = React.useCallback(async () => {
    await (supabase as any).auth?.signInWithOAuth?.({
      provider: "google",
      options: { redirectTo: window.location.origin + "/onboarding" },
    });
  }, []);

  const signOut = React.useCallback(async () => {
    await (supabase as any).auth?.signOut?.();
  }, []);

  const value: AuthContextValue = { session, user, loading, signInWithGoogle, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

