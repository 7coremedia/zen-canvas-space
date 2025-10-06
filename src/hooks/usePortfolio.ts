import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// This is the comprehensive type for a portfolio item, including all new fields.
export type PortfolioItem = {
  id: string;
  user_id?: string;
  title: string;
  slug: string;
  description?: string;
  category?: "Branding" | "Logo" | "Poster" | "Other";
  tagline?: string;
  cover_url: string;
  media_url?: string;
  media_type?: string;
  full_image_url?: string;
  year?: string;
  order_index?: number;
  is_multiple_partners?: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  client?: string;
  industry?: string;
  location?: string;
  our_role?: string;
  the_challenge?: string;
  the_solution?: string;
  notes?: any;
  is_notes_downloadable?: boolean;
  portfolio_type?: "case_study" | "project";
  brand_name?: string;
  pdf_url?: string;
  partners?: any[];
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
      // Using .upsert() requires all fields. Looping with .update() is safer for partial updates.
      for (const update of updates) {
        const { error } = await supabase
          .from("portfolios")
          .update({
            order_index: update.order_index,
            updated_at: new Date().toISOString(),
          })
          .eq("id", update.id);
        if (error) throw error;
      }
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