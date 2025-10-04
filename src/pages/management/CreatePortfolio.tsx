import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PortfolioItemForm from "@/components/forms/PortfolioItemForm";

export default function CreatePortfolio() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: createPortfolio } = useMutation({
    mutationFn: async (data: any): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: portfolio, error } = await supabase
        .from("portfolios")
        .insert([{
          ...data,
          user_id: user?.id,
          // Ensure slug is generated if not provided, or use the one from the form
          slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        }])
        .select()
        .single();

      if (error) {
        console.error("Portfolio creation error:", error);
        throw error;
      }
      
      // The logic for partners and media files can be added here if needed,
      // similar to the old implementation. For now, focusing on the core portfolio item.
      if (data.partners && data.partners.length > 0 && portfolio) {
        const partnersData = data.partners.map((partner: any) => ({
          portfolio_id: portfolio.id,
          name: partner.name,
          social_name: partner.social_name,
          social_link: partner.social_link,
          image_url: partner.image_url,
        }));

        const { error: partnersError } = await supabase
          .from("portfolio_partners")
          .insert(partnersData);

        if (partnersError) {
          console.error("Partners creation error:", partnersError);
          throw partnersError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioItems"] });
      toast({
        title: "Success",
        description: "Portfolio item created successfully",
      });
      navigate("/management/portfolio");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create portfolio item",
        variant: "destructive",
      });
      console.error("Create error:", error);
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (data: any) => {
    setIsLoading(true);
    try {
      await createPortfolio(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Create Portfolio Item – KING</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Portfolio Item</h1>
        <p className="mt-2 text-muted-foreground">
          Add a new item to showcase your work
        </p>
      </div>

      <PortfolioItemForm
        onSubmit={handleCreate}
        isSubmitting={isLoading}
      />
    </main>
  );
}