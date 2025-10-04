import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PortfolioItemForm from "@/components/forms/PortfolioItemForm";
import { type PortfolioItem } from "@/hooks/usePortfolio"; // Now using the updated central type
import { usePortfolioMedia } from "@/hooks/usePortfolioMedia";

export default function EditPortfolio() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: portfolio, isLoading: isLoadingPortfolio } = useQuery({
    queryKey: ["portfolio", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;      
      return data as PortfolioItem;
    },
  });

  // Load existing gallery media for this portfolio (exclude cover in the form)
  const { data: portfolioMedia = [], isLoading: isLoadingMedia } = usePortfolioMedia(id || "");

  const { mutateAsync: updatePortfolio } = useMutation({
    mutationFn: async (data: any): Promise<void> => {
      // This payload now includes all fields from PortfolioItemForm
      const updatePayload = {
        title: data.title,
        slug: data.slug,
        cover_url: data.cover_url,
        portfolio_type: data.portfolio_type,
        client: data.client,
        industry: data.industry,
        location: data.location,
        our_role: data.our_role,
        the_challenge: data.the_challenge,
        the_solution: data.the_solution,
        notes: data.notes,
        is_notes_downloadable: data.is_notes_downloadable,
        is_published: data.is_published,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("portfolios")
        .update(updatePayload)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioItems"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio", id] });
      toast({
        title: "Success",
        description: "Portfolio item updated successfully",
      });
      navigate("/management/portfolio");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update portfolio item",
        variant: "destructive",
      });
      console.error("Update error:", error);
    },
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (data: any) => {
    setIsUpdating(true);
    try {
      await updatePortfolio(data);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoadingPortfolio || isLoadingMedia) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-lg">Portfolio item not found</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Edit {portfolio.title} – KING</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Portfolio Item</h1>
        <p className="mt-2 text-muted-foreground">
          Update the details of your portfolio item
        </p>
      </div>

      <PortfolioItemForm
        initialData={{
          title: portfolio.title,
          slug: portfolio.slug,
          cover_url: portfolio.cover_url,
          portfolio_type: portfolio.portfolio_type,
          client: portfolio.client,
          industry: portfolio.industry,
          location: portfolio.location,
          our_role: portfolio.our_role,
          the_challenge: portfolio.the_challenge,
          the_solution: portfolio.the_solution,
          notes: portfolio.notes,
          is_notes_downloadable: portfolio.is_notes_downloadable,
          is_published: portfolio.is_published,
        }}
        onSubmit={handleUpdate}
        isSubmitting={isUpdating}
      />
    </main>
  );
}
