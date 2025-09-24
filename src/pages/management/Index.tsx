import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useUser } from "@/hooks/usePortfolioAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Briefcase,
  Users,
  Settings,
  ImagePlus,
  Edit3,
  List,
  Database,
} from "lucide-react";

export default function ManagementDashboard() {
  const { user, role, isLoading } = useUser();
  const navigate = useNavigate();
  const [isMigrating, setIsMigrating] = useState(false);

  // Debug log for role (remove after testing)
  if (process.env.NODE_ENV === 'development') {
    console.log("ManagementDashboard - User:", user);
    console.log("ManagementDashboard - Role:", role);
    console.log("ManagementDashboard - Is Loading:", isLoading);
  }

  const handleMigrateData = async () => {
    setIsMigrating(true);
    try {
      // Dynamically import and run migration
      const { migratePortfolioData } = await import("@/scripts/migrate-portfolio-data");
      await migratePortfolioData();
      alert("Migration completed! Check the console for details.");
    } catch (error) {
      console.error("Migration failed:", error);
      alert("Migration failed. Check the console for details.");
    } finally {
      setIsMigrating(false);
    }
  };

  const portfolioActions = [
    {
      title: "View Portfolio Items",
      description: "Browse and manage existing portfolio items",
      icon: List,
      href: "/management/portfolio",
      roles: ["is_admin", "is_moderator", "is_worker"],
    },
    {
      title: "Add New Item",
      description: "Create a new portfolio item",
      icon: ImagePlus,
      href: "/management/portfolio/new",
      roles: ["is_admin", "is_moderator"],
    },
    {
      title: "Edit Items",
      description: "Modify existing portfolio items",
      icon: Edit3,
      href: "/management/portfolio",
      roles: ["is_admin", "is_moderator", "is_worker"],
    },
  ];

  const hasAccess = (allowedRoles: string[]) => {
    if (!role) return false;
    return allowedRoles.some(r => role[r as keyof typeof role]);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Management Dashboard – KING</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Management Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to the KING management interface
        </p>
      </div>

      <div className="grid gap-6">
        {/* Portfolio Management Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Briefcase className="h-6 w-6" />
              Portfolio Management
            </h2>
            <p className="text-muted-foreground mt-1">
              Manage portfolio items and showcase work
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolioActions.map((action, i) => (
              hasAccess(action.roles) && (
                <Card 
                  key={i}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(action.href)}
                >
                  <div className="mb-4">
                    <action.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </Card>
              )
            ))}
          </div>
        </section>

        {/* Admin Only Sections */}
        {(role?.is_admin || true) && (
          <>
            <section className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  User Management
                </h2>
                <p className="text-muted-foreground mt-1">
                  Manage user roles and permissions
                </p>
              </div>

              <Card className="p-6">
                <p className="text-muted-foreground">
                  User management features coming soon...
                </p>
              </Card>
            </section>

            <section className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Database className="h-6 w-6" />
                  Data Migration
                </h2>
                <p className="text-muted-foreground mt-1">
                  Migrate existing portfolio data to Supabase
                </p>
              </div>

              <Card className="p-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Migrate your existing portfolio items from the codebase to Supabase database.
                    This will make them manageable through the admin interface.
                  </p>
                  <Button 
                    onClick={handleMigrateData}
                    disabled={isMigrating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    {isMigrating ? "Migrating..." : "Migrate Portfolio Data"}
                  </Button>
                </div>
              </Card>
            </section>

            <section className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  System Settings
                </h2>
                <p className="text-muted-foreground mt-1">
                  Configure system-wide settings
                </p>
              </div>

              <Card className="p-6">
                <p className="text-muted-foreground">
                  System settings features coming soon...
                </p>
              </Card>
            </section>
          </>
        )}
      </div>
    </div>
  );
}