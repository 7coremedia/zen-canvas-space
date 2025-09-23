import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
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
    return null;
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