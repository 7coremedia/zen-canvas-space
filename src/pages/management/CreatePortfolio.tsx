import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useState } from "react";
import { portfolioFormSchema } from "@/components/admin/PortfolioForm";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import PortfolioForm from "@/components/admin/PortfolioForm";

export default function CreatePortfolio() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: createPortfolio } = useMutation({
    mutationFn: async (data: z.infer<typeof portfolioFormSchema> & { media_url: string; full_image_url?: string }): Promise<void> => {
      const { error } = await supabase
        .from("portfolios")
        .insert([{
          ...data,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioItems"] });
      toast({
        title: "Success",
        description: "Portfolio item created successfully",
      });
      navigate("/dashboard/portfolio");
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

  const handleCreate = async (data: z.infer<typeof portfolioFormSchema> & { media_url: string; full_image_url?: string }) => {
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
          Add a new item to your portfolio
        </p>
      </div>

      <PortfolioForm
        onSubmit={handleCreate}
        isLoading={isLoading}
      />
    </main>
  );
}