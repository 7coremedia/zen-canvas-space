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
  BookOpen,
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
    {
      title: "Manage Volumes",
      description: "Create, edit, and publish KING Volumes",
      icon: BookOpen,
      href: "/management/volumes",
      roles: ["is_admin", "is_moderator"],
    },
  ];
  const hasAccess = (allowedRoles: string[]) => {
    if (!role) return false;
    return allowedRoles.some(r => role[r as keyof typeof role]);
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Management Dashboard – KING</title>
      </Helmet>

      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Management Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome to the KING management interface
          </p>
        </header>

        <div className="space-y-12">
          {/* Portfolio Management Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3 text-gray-800">
                <Briefcase className="h-7 w-7" />
                <span>
                  <span className="sm:hidden">Portfolio Mgt</span>
                  <span className="hidden sm:inline">Portfolio Management</span>
                </span>
              </h2>
              <p className="text-gray-500 mt-1">
                Manage portfolio items and showcase work
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {portfolioActions.map((action, i) => (
                hasAccess(action.roles) && (
                  <Card 
                    key={i}
                    className="bg-gray-100 p-3 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col items-center justify-center aspect-square sm:aspect-auto text-center"
                    onClick={() => navigate(action.href)}
                  >
                    <div className="mb-2 sm:mb-4">
                      <action.icon className="h-7 w-7 sm:h-10 sm:w-10 text-gray-700 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-semibold text-xs sm:text-lg mb-0.5 sm:mb-1 text-gray-900">
                      <span className="sm:hidden">
                        {action.title.includes('View') ? 'View' : action.title.includes('Add') ? 'Add' : action.title.includes('Edit') ? 'Edit' : action.title}
                      </span>
                      <span className="hidden sm:inline">{action.title}</span>
                    </h3>
                    <p className="hidden sm:block text-sm text-gray-500">
                      {action.description}
                    </p>
                  </Card>
                )
              ))}
            </div>
          </section>

          {/* Admin Only Sections */}
          {(role?.is_admin) && (
            <div className="space-y-12">
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold flex items-center gap-3 text-gray-800">
                    <Users className="h-7 w-7" />
                    <span>
                      <span className="sm:hidden">User Mgt</span>
                      <span className="hidden sm:inline">User Management</span>
                    </span>
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Manage user roles and permissions
                  </p>
                </div>

                <Card className="bg-gray-100 p-6 rounded-2xl shadow-sm">
                  <p className="text-gray-500">
                    User management features coming soon...
                  </p>
                </Card>
              </section>

              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold flex items-center gap-3 text-gray-800">
                    <Database className="h-7 w-7" />
                    <span>Data Migration</span>
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Migrate existing portfolio data to Supabase
                  </p>
                </div>

                <Card className="bg-gray-100 p-6 rounded-2xl shadow-sm">
                  <div className="space-y-4">
                    <p className="text-gray-500">
                      Migrate your existing portfolio items from the codebase to Supabase database.
                      This will make them manageable through the admin interface.
                    </p>
                    <Button 
                      onClick={handleMigrateData}
                      disabled={isMigrating}
                      className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg px-5 py-2.5 transition-colors"
                    >
                      <Database className="h-5 w-5 mr-2" />
                      {isMigrating ? "Migrating..." : "Migrate Portfolio Data"}
                    </Button>
                  </div>
                </Card>
              </section>

              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold flex items-center gap-3 text-gray-800">
                    <Settings className="h-7 w-7" />
                    <span>System Settings</span>
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Configure system-wide settings
                  </p>
                </div>

                <Card className="bg-gray-100 p-6 rounded-2xl shadow-sm">
                  <p className="text-gray-500">
                    System settings features coming soon...
                  </p>
                </Card>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}