import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/usePortfolioAuth";

export default function ProtectedLayout() {
  const { user, role, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !(role?.is_admin || role?.is_moderator || role?.is_worker)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="max-w-lg w-full p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Access denied</h2>
          <p className="text-sm text-muted-foreground mb-6">
            You don’t have permission to view the management area. If you believe this is a mistake, please ensure your account has a role assigned in Supabase (admin, moderator, or worker) and try again.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" onClick={() => navigate("/")}>Go home</Button>
            <Button onClick={() => navigate("/auth")}>Sign in</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation */}
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="mr-8 flex items-center">
            <a href="/" className="text-xl font-bold">
              KING
            </a>
          </div>
          
          {/* Role-based nav items */}
          <div className="flex gap-6">
            <a 
              href="/management/portfolio" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Portfolio Management
            </a>
            {(role?.is_admin || role?.is_moderator) && (
              <a 
                href="/management/users" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                User Management
              </a>
            )}
          </div>

          {/* User Info */}
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {role?.is_admin ? "Admin" : role?.is_moderator ? "Moderator" : "Worker"}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <Outlet />
    </div>
  );
}