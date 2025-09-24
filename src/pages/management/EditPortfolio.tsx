import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CreatePortfolioFormV2 from "@/components/admin/CreatePortfolioFormV2";
import { PortfolioItem } from "@/hooks/usePortfolio";

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

  const { mutateAsync: updatePortfolio } = useMutation({
    mutationFn: async (data: any): Promise<void> => {
      const updatePayload = {
        title: data.title,
        client: data.client ?? null,
        category: data.category,
        tagline: data.tagline,
        year: data.year ?? null,
        cover_url: data.media_url,
        media_url: data.media_url,
        media_type: 'image' as const,
        full_image_url: data.full_image_url ?? data.media_url,
        is_published: data.is_published,
        is_multiple_partners: data.is_multiple_partners ?? false,
        brand_name: data.brand_name ?? null,
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

  if (isLoadingPortfolio) {
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

      <CreatePortfolioFormV2
        initialData={{
          title: portfolio.title,
          client: (portfolio as any).client,
          category: portfolio.category as any,
          tagline: (portfolio as any).tagline,
          year: (portfolio as any).year,
          is_published: portfolio.is_published,
          is_multiple_partners: (portfolio as any).is_multiple_partners,
          brand_name: (portfolio as any).brand_name,
          media_url: (portfolio as any).media_url ?? (portfolio as any).cover_url,
          full_image_url: (portfolio as any).full_image_url ?? (portfolio as any).media_url,
        }}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
      />
    </main>
  );
}
