import { useState, useEffect } from "react";
import { useUser } from "@/hooks/usePortfolioAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Clock, User } from "lucide-react";

interface RoleRequest {
  id: string;
  user_id: string;
  email: string;
  requested_role: string;
  reason?: string;
  status: string;
  created_at: string;
  reviewed_at?: string;
  review_notes?: string;
}

export default function RoleManagement() {
  const { user } = useUser();
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadRoleRequests();
  }, []);

  const loadRoleRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("role_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error loading role requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc("approve_role_request", {
        request_id: requestId,
        approver_id: user.id,
      });

      if (error) throw error;

      // Reload requests
      await loadRoleRequests();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc("reject_role_request", {
        request_id: requestId,
        approver_id: user.id,
        review_notes: reviewNotes[requestId] || null,
      });

      if (error) throw error;

      // Clear review notes for this request
      setReviewNotes(prev => ({ ...prev, [requestId]: "" }));
      
      // Reload requests
      await loadRoleRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading role requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Role Management</h2>
        <p className="text-muted-foreground">Review and approve role requests</p>
      </div>

      {requests.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No role requests found.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{request.email}</span>
                    {getStatusIcon(request.status)}
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Requested: <span className="font-medium capitalize">{request.requested_role}</span></p>
                    <p>Submitted: {new Date(request.created_at).toLocaleDateString()}</p>
                    {request.reason && (
                      <p className="mt-2 italic">"{request.reason}"</p>
                    )}
                  </div>

                  {request.status === "pending" && (
                    <div className="space-y-3 mt-4">
                      <div>
                        <Label htmlFor={`notes-${request.id}`}>Review Notes (Optional)</Label>
                        <Textarea
                          id={`notes-${request.id}`}
                          placeholder="Add notes for the user..."
                          value={reviewNotes[request.id] || ""}
                          onChange={(e) => setReviewNotes(prev => ({ ...prev, [request.id]: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {request.review_notes && (
                    <Alert className="mt-3">
                      <AlertDescription>
                        <strong>Review Notes:</strong> {request.review_notes}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
