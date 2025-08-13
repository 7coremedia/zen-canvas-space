import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type Props = { open: boolean; onOpenChange: (v: boolean) => void; onContinue?: () => void };

export default function AuthDialog({ open, onOpenChange, onContinue }: Props) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSignIn = async () => {
    if (!email || !password) return;
    
    setLoading(true);
    try {
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
          description: "You've been signed in successfully.",
        });
        onOpenChange(false);
        onContinue?.();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) return;
    
    setLoading(true);
    try {
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
        onOpenChange(false);
        onContinue?.();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Authentication failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        onOpenChange(false);
        onContinue?.();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save your progress</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Create an account or log in so your onboarding answers are saved.</p>
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="you@brand.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <Button 
                onClick={handleSignIn} 
                disabled={loading || !email || !password}
                className="w-full"
              >
                Sign In
              </Button>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="you@brand.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <Input 
                  type="password" 
                  placeholder="Create password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <Button 
                onClick={handleSignUp} 
                disabled={loading || !email || !password}
                className="w-full"
              >
                Create Account
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="text-center text-xs text-muted-foreground">or</div>
          <Button 
            variant="outline" 
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full"
          >
            Continue with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

