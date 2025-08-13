import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

type Props = { open: boolean; onOpenChange: (v: boolean) => void; onContinue?: () => void };

export default function AuthDialog({ open, onOpenChange, onContinue }: Props) {
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const signInEmail = async () => {
    try {
      setLoading(true);
      // Magic-link style sign-in if configured
      // If not configured, gracefully no-op
      // @ts-ignore
      await window?.supabase?.auth?.signInWithOtp?.({ email });
      onOpenChange(false);
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
          <div className="flex gap-2">
            <Input type="email" placeholder="you@brand.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button onClick={signInEmail} disabled={loading || !email}>Continue</Button>
          </div>
          <div className="text-center text-xs text-muted-foreground">or</div>
          <Button variant="outline" onClick={async () => { await signInWithGoogle(); onOpenChange(false); onContinue?.(); }}>Continue with Google</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

