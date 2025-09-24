import { useState } from "react";
import { useUser } from "@/hooks/usePortfolioAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function RoleRequestForm() {
  const { user } = useUser();
  const [requestedRole, setRequestedRole] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !requestedRole) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      const { error } = await supabase
        .from("role_requests")
        .insert({
          user_id: user.id,
          email: user.email || "",
          requested_role: requestedRole,
          reason: reason || null,
        });

      if (error) throw error;

      setStatus("success");
      setMessage("Role request submitted successfully! An admin will review your request.");
      setRequestedRole("");
      setReason("");
    } catch (error) {
      console.error("Error submitting role request:", error);
      setStatus("error");
      setMessage("Failed to submit role request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Request Management Access</h2>
          <p className="text-sm text-muted-foreground">
            Request access to manage portfolio items and content.
          </p>
        </div>

        {status === "success" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Requested Role</Label>
            <Select value={requestedRole} onValueChange={setRequestedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="worker">Worker - Can add and edit portfolio items</SelectItem>
                <SelectItem value="moderator">Moderator - Can manage all content and approve items</SelectItem>
                <SelectItem value="admin">Admin - Full system access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Why do you need this access? What will you be working on?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!requestedRole || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>

        <div className="text-xs text-muted-foreground">
          <p>Your request will be reviewed by an administrator. You'll be notified once approved.</p>
        </div>
      </div>
    </Card>
  );
}
