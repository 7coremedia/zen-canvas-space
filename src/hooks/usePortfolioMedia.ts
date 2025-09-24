import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PortfolioMediaItem {
  id: string;
  portfolio_id: string;
  url: string;
  media_type: string;
  file_name: string;
  file_size?: number;
  display_order: number;
  is_cover: boolean;
  created_at: string;
  updated_at: string;
}

export function usePortfolioMedia(portfolioId: string) {
  return useQuery({
    queryKey: ["portfolioMedia", portfolioId],
    queryFn: async (): Promise<PortfolioMediaItem[]> => {
      const { data, error } = await (supabase as any)
        .from("portfolio_media")
        .select("*")
        .eq("portfolio_id", portfolioId)
        .order("display_order");

      if (error) throw error;
      return data || [];
    },
    enabled: !!portfolioId,
  });
}

export function usePublicPortfolioMedia(portfolioId: string) {
  return useQuery({
    queryKey: ["publicPortfolioMedia", portfolioId],
    queryFn: async (): Promise<PortfolioMediaItem[]> => {
      // Only fetch media for published portfolios
      const { data, error } = await supabase
        .from("portfolio_media")
        .select(`
          *,
          portfolios!inner(is_published)
        `)
        .eq("portfolio_id", portfolioId)
        .eq("portfolios.is_published", true)
        .order("display_order");

      if (error) throw error;
      return data || [];
    },
    enabled: !!portfolioId,
  });
}
