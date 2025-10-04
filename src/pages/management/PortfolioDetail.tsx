import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProjectInfoOverlay from "@/components/smart-blocks/ProjectInfoOverlay";
// import { type PortfolioItem } from "@/hooks/usePortfolio"; // This is likely outdated
import { Loader2 } from "lucide-react";

// Temporary updated type. You should move this to a central types file like `src/hooks/usePortfolio.ts`.
export type PortfolioItem = {
  id: string;
  title: string;
  slug: string;
  cover_url: string;
  portfolio_type: "case_study" | "project";
  client?: string;
  industry?: string;
  location?: string;
  our_role?: string;
  the_challenge?: string;
  the_solution?: string;
  notes?: any;
  is_notes_downloadable?: boolean;
  is_published: boolean;
};

/**
 * This is an example of a portfolio detail page.
 * You should apply this logic to your actual portfolio page component.
 */
export default function PortfolioDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  // 1. Fetch the specific portfolio item's data from Supabase using its slug
  const { data: portfolioItem, isLoading, isError } = useQuery({
    queryKey: ["portfolioItem", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*") // Select all columns, including our new ones
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as PortfolioItem;
    },
    enabled: !!slug, // Only run query if slug exists
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading project...</span>
      </div>
    );
  }

  if (isError || !portfolioItem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Project not found.</p>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      {/* 
        Your existing portfolio page content goes here.
        (e.g., hero image, project description, image gallery, etc.)
      */}
      <div className="container mx-auto py-16">
        <h1 className="text-5xl font-bold">{portfolioItem.title}</h1>
        <p className="text-muted-foreground mt-2">Client: {portfolioItem.client}</p>
        <img src={portfolioItem.cover_url} alt={portfolioItem.title} className="mt-8 rounded-lg shadow-lg w-full" />
      </div>

      {/* 2. Place the floating "About project" button here */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <ProjectInfoOverlay projectData={portfolioItem} />
      </div>
    </main>
  );
}