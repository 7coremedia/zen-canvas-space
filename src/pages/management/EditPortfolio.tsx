import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CreatePortfolioFormV2 from "@/components/admin/CreatePortfolioFormV2";
import { PortfolioItem } from "@/hooks/usePortfolio";
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
      const updatePayload = {
        title: data.title,
        client: data.client ?? null,
        category: data.category,
        tagline: data.tagline,
        year: data.year ?? null,
        cover_url: data.media_url, // Treat media_url from form as the dedicated cover
        media_url: data.media_url,
        media_type: 'image' as const,
        full_image_url: data.full_image_url ?? data.media_url,
        is_published: data.is_published,
        is_multiple_partners: data.is_multiple_partners ?? false,
        brand_name: data.brand_name ?? null,
        // New fields
        industry: data.industry,
        location: data.location,
        our_role: data.our_role,
        the_challenge: data.the_challenge,
        the_solution: data.the_solution,
        notes: data.notes,
        is_notes_downloadable: data.is_notes_downloadable,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("portfolios")
        .update(updatePayload)
        .eq("id", id);

      if (error) throw error;

      // Persist gallery media (exclude cover) using desired list from the form
      const desiredFiles: Array<{ id?: string; url: string; type: string; name: string; size?: number }> =
        Array.isArray(data.media_files) ? data.media_files : [];

      // Fetch current media from DB
      const { data: existingMedia, error: fetchMediaError } = await supabase
        .from("portfolio_media")
        .select("id,url,is_cover")
        .eq("portfolio_id", id);
      if (fetchMediaError) throw fetchMediaError;

      const existingNonCover = (existingMedia || []).filter((m) => !m.is_cover);
      const existingByUrl = new Map(existingNonCover.map((m) => [m.url, m]));
      const desiredUrls = new Set(desiredFiles.map((f) => f.url));

      // Delete removed
      const toDelete = existingNonCover.filter((m) => !desiredUrls.has(m.url)).map((m) => m.id);
      if (toDelete.length) {
        const { error: delErr } = await supabase
          .from("portfolio_media")
          .delete()
          .in("id", toDelete);
        if (delErr) throw delErr;
      }

      // Upsert/update order for remaining and insert new
      const inserts: any[] = [];
      const updates: Array<{ id: string; display_order: number }> = [];

      desiredFiles.forEach((f, index) => {
        const match = existingByUrl.get(f.url);
        if (match) {
          updates.push({ id: match.id, display_order: index });
        } else {
          inserts.push({
            portfolio_id: id,
            url: f.url,
            media_type: f.type,
            file_name: f.name,
            file_size: f.size ?? null,
            display_order: index,
            is_cover: false,
          });
        }
      });

      if (inserts.length) {
        const { error: insErr } = await supabase
          .from("portfolio_media")
          .insert(inserts);
        if (insErr) throw insErr;
      }

      if (updates.length) {
        // Batch update display orders
        for (const u of updates) {
          const { error: updErr } = await supabase
            .from("portfolio_media")
            .update({ display_order: u.display_order })
            .eq("id", u.id);
          if (updErr) throw updErr;
        }
      }
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

      <CreatePortfolioFormV2
        initialData={{
          title: portfolio.title,
          client: (portfolio as any).client,
          category: portfolio.category as any,
          tagline: (portfolio as any).tagline,
          year: (portfolio as any).year,
          is_published: portfolio.is_published,
          // New fields
          industry: (portfolio as any).industry,
          location: (portfolio as any).location,
          our_role: (portfolio as any).our_role,
          the_challenge: (portfolio as any).the_challenge,
          the_solution: (portfolio as any).the_solution,
          notes: (portfolio as any).notes,
          is_notes_downloadable: (portfolio as any).is_notes_downloadable,
          is_multiple_partners: (portfolio as any).is_multiple_partners,
          brand_name: (portfolio as any).brand_name,
          media_url: (portfolio as any).cover_url ?? (portfolio as any).media_url,
          full_image_url: (portfolio as any).full_image_url ?? (portfolio as any).cover_url,
          media_files: (portfolioMedia || [])
            .filter((m) => !m.is_cover)
            .map((m) => ({
              id: m.id,
              url: m.url,
              type: m.media_type as any,
              name: m.file_name,
              size: m.file_size ?? undefined,
            })),
        }}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
      />
    </main>
  );
}
