import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';

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

        // --- Save pending data after sign-in ---
        if (event === "SIGNED_IN" && session?.user) {
          // Handle pending wizard data first
          const pendingWizardData = sessionStorage.getItem('pendingWizardData');
          if (pendingWizardData) {
            try {
              const wizardData = JSON.parse(pendingWizardData);
              
              // Save brand data to database
              const { data: brand, error } = await supabase
                .from('brands')
                .insert({
                  brand_name: wizardData.name,
                  description: wizardData.description,
                  colors: wizardData.colors,
                  typography: wizardData.typography,
                  logo_url: wizardData.logo?.url,
                  logo_alt: wizardData.logo?.alt,
                  user_id: session.user.id,
                  is_primary: false,
                })
                .select()
                .single();

              if (error) throw error;

              sessionStorage.removeItem('pendingWizardData');
              toast({
                title: "Welcome!",
                description: "Your brand has been successfully saved.",
              });

            } catch (error: any) {
              console.error("Failed to save pending wizard data:", error);
              toast({
                title: "Save Failed",
                description: "We couldn't save your brand data. Please contact support.",
                variant: "destructive",
              });
            }
          }

          // Handle pending onboarding data
          const pendingOnboardingData = sessionStorage.getItem('pendingOnboardingData');
          if (pendingOnboardingData) {
            try {
              const onboardingData = JSON.parse(pendingOnboardingData);
              
              // Send email with onboarding data
              const templateParams = {
                brand_name: onboardingData.brand_name,
                elevator_pitch: onboardingData.elevator_pitch,
                sender_name: onboardingData.sender_name,
                sender_email: onboardingData.sender_email,
                industry: onboardingData.industry,
                offerings: onboardingData.offerings,
                primary_audience: onboardingData.primary_audience,
                one_year_vision: onboardingData.one_year_vision,
                budget: onboardingData.budget,
                launch_timeline: onboardingData.launch_timeline,
              };

              await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID!,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
                templateParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
              );

              sessionStorage.removeItem('pendingOnboardingData');
              toast({
                title: "Welcome!",
                description: "Your onboarding has been completed successfully.",
              });

            } catch (error: any) {
              console.error("Failed to submit pending onboarding data:", error);
              toast({
                title: "Submission Failed",
                description: "We couldn't submit your onboarding data. Please contact support.",
                variant: "destructive",
              });
            }
          }

          // Handle pending brand data
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
      options: { redirectTo: "https://kingsempire.vercel.app" },
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

