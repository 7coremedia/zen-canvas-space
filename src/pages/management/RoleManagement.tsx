import { Helmet } from "react-helmet-async";
import { useUser } from "@/hooks/usePortfolioAuth";
import RoleManagementComponent from "@/components/admin/RoleManagement";

export default function RoleManagementPage() {
  const { user, role } = useUser();

  return (
    <main className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Role Management – KING</title>
      </Helmet>
      
      <RoleManagementComponent />
    </main>
  );
}
