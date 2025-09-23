import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import { portfolioFormSchema } from "@/components/admin/PortfolioForm";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import PortfolioForm from "@/components/admin/PortfolioForm";
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
    mutationFn: async (data: z.infer<typeof portfolioFormSchema> & { media_url: string; full_image_url?: string }): Promise<void> => {
      const { error } = await supabase
        .from("portfolios")
        .update(data)
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
      navigate("/dashboard/portfolio");
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

  const handleUpdate = async (data: z.infer<typeof portfolioFormSchema> & { media_url: string; full_image_url?: string }) => {
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

      <PortfolioForm
        initialData={portfolio}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
      />
    </main>
  );
}