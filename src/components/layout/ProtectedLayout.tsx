import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/usePortfolioAuth";
import RoleRequestForm from "@/components/admin/RoleRequestForm";

export default function ProtectedLayout() {
  const { user, role, isLoading } = useUser();
  const navigate = useNavigate();
  const hasMgmtAccess = Boolean((role as any)?.is_admin || (role as any)?.is_moderator || (role as any)?.is_worker);

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

  if (!user || !hasMgmtAccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Management Access Required</h1>
              <p className="text-muted-foreground">
                You need special permissions to access the management area.
              </p>
              
              {/* Debug info */}
              <div className="mt-4 p-4 bg-gray-100 rounded text-sm text-left">
                <p><strong>Debug Info:</strong></p>
                <p>User: {user ? user.email : "Not logged in"}</p>
                <p>Role: {role ? JSON.stringify(role) : "No role found"}</p>
                <p>Loading: {isLoading ? "Yes" : "No"}</p>
              </div>
            </div>
            
            <RoleRequestForm />
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate("/")}>Go home</Button>
              <Button onClick={() => navigate("/auth")}>Sign in</Button>
            </div>
          </div>
        </div>
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
              <span className="sm:hidden">Portfolio Mgt</span>
              <span className="hidden sm:inline">Portfolio Management</span>
            </a>
            {(role?.is_admin || role?.is_moderator) && (
              <a
                href="/management/volumes"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                <span className="sm:hidden">Volumes</span>
                <span className="hidden sm:inline">Volumes Management</span>
              </a>
            )}
            {(role?.is_admin || role?.is_moderator) && (
              <a 
                href="/management/roles" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                <span className="sm:hidden">Role Mgt</span>
                <span className="hidden sm:inline">Role Management</span>
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