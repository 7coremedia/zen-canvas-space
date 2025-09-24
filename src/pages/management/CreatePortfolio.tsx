import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import CreatePortfolioForm from "@/components/admin/CreatePortfolioForm";

export default function CreatePortfolio() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: createPortfolio } = useMutation({
    mutationFn: async (data: any): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // First, create the portfolio item
      const { data: portfolio, error } = await supabase
        .from("portfolios")
        .insert([{
          slug: data.title.toLowerCase().replace(/\s+/g, '-'),
          title: data.title,
          client: data.client,
          category: data.category,
          tagline: data.tagline,
          year: data.year,
          cover_url: data.media_url,
          full_image_url: data.full_image_url,
          is_published: data.is_published,
          is_multiple_partners: data.is_multiple_partners || false,
          brand_name: data.brand_name,
          order_index: 0,
          user_id: user?.id,
        }])
        .select()
        .single();

      if (error) {
        console.error("Portfolio creation error:", error);
        throw error;
      }

      // Then, create partners if they exist
      if (data.partners && data.partners.length > 0) {
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

      <CreatePortfolioForm
        onSubmit={handleCreate}
        isLoading={isLoading}
      />
    </main>
  );
}