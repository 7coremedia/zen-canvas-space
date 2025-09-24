import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { usePublicPortfolioItem, usePublicPortfolio } from "@/hooks/usePublicPortfolio";
import { usePublicPortfolioMedia } from "@/hooks/usePortfolioMedia";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import MultiplePartnersHeader from "@/components/case-study/MultiplePartnersHeader";
import SinglePartnerHeader from "@/components/case-study/SinglePartnerHeader";
import PortfolioMediaDisplay from "@/components/portfolio/PortfolioMediaDisplay";
import PortfolioItem from "@/components/portfolio/PortfolioItem";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const { data: currentCaseStudy, isLoading, error } = usePublicPortfolioItem(slug || '');
  const { data: portfolioMedia, isLoading: isLoadingMedia } = usePublicPortfolioMedia(currentCaseStudy?.id || '');
  const { data: allPortfolioItems } = usePublicPortfolio();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.20))]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio item...</p>
        </div>
      </div>
    );
  }

  if (error || !currentCaseStudy) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.20))]">
        <p className="text-xl text-gray-600">Case study not found.</p>
      </div>
    );
  }

  // Filter related case studies (excluding the current one) by category
  const relatedCaseStudies = React.useMemo(() => {
    if (!allPortfolioItems || !currentCaseStudy) return [];
    return allPortfolioItems
      .filter(item => item.slug !== slug && item.category === currentCaseStudy.category)
      .slice(0, 3); // Limit to 3 related items
  }, [allPortfolioItems, currentCaseStudy, slug]);

  // Placeholder for project tags/keywords
  const projectTags = [
    currentCaseStudy.category,
    currentCaseStudy.client || "Client Work",
    "Design",
    "Creative",
    "KING",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{currentCaseStudy.title} – KING</title>
        <meta
          name="description"
          content={currentCaseStudy.tagline}
        />
        <link rel="canonical" href={`/portfolio/${slug}`} />
      </Helmet>

      {/* Conditional Header Rendering */}
      {currentCaseStudy.is_multiple_partners ? (
        <MultiplePartnersHeader
          title={currentCaseStudy.title}
          brandName={currentCaseStudy.brand_name || currentCaseStudy.title}
          partners={(currentCaseStudy.partners || []).map(partner => ({
            id: partner.id,
            name: partner.name,
            socialName: partner.social_name,
            imageUrl: partner.image_url,
            socialLink: partner.social_link,
          }))}
        />
      ) : (
        <CaseStudyHeader
          title={currentCaseStudy.title}
          owner={currentCaseStudy.client || "KING Team"}
        />
      )}

      {/* Main Media Section - No Container for full-width */} 
      <section className="w-full pt-4 pb-8">
        <PortfolioMediaDisplay
          coverImage={currentCaseStudy.cover_url ? {
            id: 'cover',
            url: currentCaseStudy.cover_url,
            type: 'image',
            name: currentCaseStudy.title
          } : undefined}
          mediaFiles={portfolioMedia?.map(media => ({
            id: media.id,
            url: media.url,
            type: media.media_type as 'image' | 'video' | 'gif' | 'pdf',
            name: media.file_name
          })) || []}
        />
      </section>

      {/* Tags Section (below main image) */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {projectTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* SEO Details / Brand Info Section */}
        <div className="mb-12 border-t border-b border-gray-200 py-6">
          <h2 className="font-display text-2xl font-medium mb-3">Project Details</h2>
          <p className="text-gray-700 text-base mb-2">
            <span className="font-semibold">Brand:</span> {currentCaseStudy.client || "Confidential Brand"}
          </p>
          <p className="text-gray-700 text-base">
            <span className="font-semibold">Year:</span> {currentCaseStudy.year}
          </p>
          <p className="text-gray-700 text-base mt-2">
            {currentCaseStudy.tagline}
          </p>
        </div>

        {/* More Projects Section */}
        {relatedCaseStudies.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-3xl font-medium mb-8">More Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {relatedCaseStudies.map((item, index) => (
                <PortfolioItem
                  key={index}
                  title={item.title}
                  category={item.category}
                  imageUrl={item.cover_url}
                  slug={item.slug}
                />
              ))}
            </div>
          </div>
        )}

      </section>

      {/* Bottom Buttons/Navigation (similar to header buttons) */}
      <div className="w-full bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8 flex flex-row items-center justify-center gap-3 shadow-sm mt-8 overflow-x-auto">
        <Button asChild variant="secondary" className="gold-shimmer text-black hover:bg-yellow-500 text-sm px-4 py-2 h-auto flex-shrink-0 font-semibold transition-all duration-300 hover:scale-105">
          <Link to="/contact">Request for this</Link>
        </Button>


      </div>
    </div>
  );
}
