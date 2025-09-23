import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type PortfolioItem = {
  id: string;
  title: string;
  description?: string;
  client?: string;
  category: "Branding" | "Logo" | "Poster" | "Other";
  tagline?: string;
  media_url: string;
  media_type: string;
  full_image_url?: string;
  year?: string;
  order_index: number;
  is_multiple_partners: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export function usePortfolioItems() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["portfolioItems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .order("order_index");

      if (error) throw error;
      return data as PortfolioItem[];
    },
  });

  const updateOrder = useMutation({
    mutationFn: async (updates: { id: string; order_index: number }[]) => {
      // Use UPSERT to handle multiple updates in one call
      const { error } = await supabase
        .from("portfolios")
        .upsert(
          updates.map(({ id, order_index }) => ({
            id,
            order_index,
            updated_at: new Date().toISOString(),
          }))
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioItems"] });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("portfolios")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioItems"] });
    },
  });

  const updateOrderAsync = async (updates: { id: string; order_index: number }[]) => {
    return updateOrder.mutateAsync(updates);
  };

  const deleteItemAsync = async (id: string) => {
    return deleteItem.mutateAsync(id);
  };

  return {
    data,
    isLoading,
    error,
    updateOrder: updateOrderAsync,
    deleteItem: deleteItemAsync,
  };
}