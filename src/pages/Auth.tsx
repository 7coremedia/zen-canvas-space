import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import emailjs from '@emailjs/browser';

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleUserRedirect = async () => {
      if (user) {
        console.log("User authenticated, handling redirect...", user);
        
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
                user_id: user.id,
                is_primary: false,
              })
              .select()
              .single();

            if (error) throw error;

            sessionStorage.removeItem('pendingWizardData');
            toast({ 
              title: "Brand Created!", 
              description: "Your brand has been successfully saved. Welcome!" 
            });
            navigate(`/brand/${brand.id}`);
            return; // Exit early if we're handling wizard data
          } catch (error: any) {
            console.error("Failed to save wizard data:", error);
            toast({ 
              title: "Save Failed", 
              description: error.message || "Could not save your brand. Please try again.", 
              variant: "destructive" 
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
              title: "Onboarding Completed!", 
              description: "Your brand details have been successfully submitted. Welcome!" 
            });
            navigate('/dashboard');
            return; // Exit early if we're handling onboarding data
          } catch (error: any) {
            console.error("Failed to submit onboarding data:", error);
            toast({ 
              title: "Submission Failed", 
              description: error.message || "Could not submit your onboarding data. Please try again.", 
              variant: "destructive" 
            });
          }
        }
        
        // Handle pending brand data
        const pendingData = sessionStorage.getItem('pendingBrandData');
        if (pendingData) {
          try {
            const brandData = JSON.parse(pendingData);
            const { data, error } = await supabase
              .from('brands')
              .insert({ ...brandData, user_id: user.id, is_primary: false })
              .select()
              .single();

            if (error) throw error;

            sessionStorage.removeItem('pendingBrandData');
            toast({ title: "Brand profile created!", description: "Your new brand has been saved." });
            navigate(`/brand/${data.id}`);
            return; // Exit early if we're handling brand data
          } catch (error: any) {
            console.error("Failed to save brand data:", error);
            toast({ title: "Save Failed", description: error.message || "Could not save your brand.", variant: "destructive" });
          }
        }
        
        // If no pending data, redirect to dashboard or home
        console.log("Redirecting authenticated user to dashboard");
        navigate('/dashboard');
      }
    };

    handleUserRedirect();
  }, [user, navigate, toast]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signInWithEmail(email, password);
    
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      const redirectTo = location.state?.redirectTo || '/dashboard';
      navigate(redirectTo);
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUpWithEmail(email, password);
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    }
    
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Helmet>
        <title>Sign In - KING</title>
        <meta name="description" content="Sign in to your KING account or create a new one to access your brand strategy." />
        <link rel="canonical" href="/auth" />
      </Helmet>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">Welcome to KING</CardTitle>
          <CardDescription>
            {location.state?.fromOnboarding 
              ? "Please sign up or sign in to complete your onboarding." 
              : location.state?.fromWizard
              ? "Please sign up or sign in to save your brand."
              : "Sign in to access your brand strategy"
            }
          </CardDescription>
          {location.state?.message && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">{location.state.message}</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}