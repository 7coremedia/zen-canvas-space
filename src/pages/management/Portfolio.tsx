import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useUser } from "@/hooks/usePortfolioAuth";
import PortfolioManager from "@/components/admin/PortfolioManager";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function DashboardPortfolio() {
  const { user, role } = useUser();
  const navigate = useNavigate();

  // Redirect if not authorized
  useEffect(() => {
    if (!user || !(role?.is_admin || role?.is_moderator || role?.is_worker)) {
      navigate("/");
    }
  }, [user, role, navigate]);

  if (!user || !(role?.is_admin || role?.is_moderator || role?.is_worker)) {
    return (
      <main className="container mx-auto py-8 px-4">
        <Card className="p-6">
          <h1 className="text-2xl font-semibold mb-2">Access required</h1>
          <p className="text-sm text-muted-foreground">
            You need an admin, moderator, or worker role to manage portfolio items.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Portfolio Management – KING</title>
      </Helmet>
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Portfolio Management</h1>
        <Button onClick={() => navigate("/management/portfolio/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Portfolio Item
        </Button>
      </div>

      <PortfolioManager />
    </main>
  );
}