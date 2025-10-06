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
import ProjectInfoOverlay from "@/components/smart-blocks/ProjectInfoOverlay";
import PortfolioActions from "@/components/portfolio/PortfolioActions";
import { cn } from '@/lib/utils';

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const { data: currentCaseStudy, isLoading, error } = usePublicPortfolioItem(slug || '');
  const { data: portfolioMedia, isLoading: isLoadingMedia } = usePublicPortfolioMedia(currentCaseStudy?.id || '');
  
  // Fetch all portfolio items to find related ones.
  // Note: usePublicPortfolioItem already fetches the full item, so we can use `currentCaseStudy` for the overlay.
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
  const relatedCaseStudies = (allPortfolioItems || [])
    .filter((item) => currentCaseStudy && item.slug !== slug && item.category === currentCaseStudy.category)
    .slice(0, 3);

  // Placeholder for project tags/keywords
  const projectTags = [
    currentCaseStudy.category,
    currentCaseStudy.client || "Client Work",
    currentCaseStudy.industry || "Design",
    "Creative",
    "KING",
  ];

  const roleItems = (currentCaseStudy.our_role || "")
    .split(/\r?\n|•|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  const challengeParagraphs = (currentCaseStudy.the_challenge || "")
    .split(/\n+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  const solutionParagraphs = (currentCaseStudy.the_solution || "")
    .split(/\n+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

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
          slug={slug || ''}
        />
      ) : (
        <CaseStudyHeader
          title={currentCaseStudy.title}
          owner={currentCaseStudy.client || "KING Team"}
          slug={slug || ''}
        />
      )}

      {/* Cover Image */}
      {currentCaseStudy.cover_url && (
        <section className="w-full pt-6 pb-8">
          <div className="container mx-auto px-4">
            <div className="overflow-hidden rounded-3xl border border-black/5 shadow-sm bg-white">
              <img
                src={currentCaseStudy.cover_url}
                alt={`${currentCaseStudy.title} cover`}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Project Overview */}
      <section className="container mx-auto px-4 pt-6 pb-6">
        <div className="lg:flex lg:justify-end">
          <div className="w-full lg:max-w-5xl">
            <div className="grid gap-10 lg:grid-cols-[minmax(240px,280px)_minmax(320px,1fr)] lg:items-start">
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xs uppercase tracking-[0.35em] text-gray-500 mb-2">Client</h2>
                  <p className="text-base text-gray-900 font-medium">
                    {currentCaseStudy.client || "Confidential"}
                  </p>
                  {currentCaseStudy.client_url && (
                    <a
                      href={currentCaseStudy.client_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm text-gray-600 underline underline-offset-4"
                    >
                      {currentCaseStudy.client_url.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>

                <div className="grid gap-4">
                  <div>
                    <h3 className="font-display text-xs uppercase tracking-[0.35em] text-gray-500 mb-1">Industry</h3>
                    <p className="text-sm text-gray-700">
                      {currentCaseStudy.industry || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display text-xs uppercase tracking-[0.35em] text-gray-500 mb-1">Location</h3>
                    <p className="text-sm text-gray-700">
                      {currentCaseStudy.location || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display text-xs uppercase tracking-[0.35em] text-gray-500 mb-1">Year</h3>
                    <p className="text-sm text-gray-700">
                      {currentCaseStudy.year || new Date(currentCaseStudy.created_at).getFullYear()}
                    </p>
                  </div>
                </div>

                {(roleItems.length > 0 || currentCaseStudy.our_role) && (
                  <div>
                    <h3 className="font-display text-xs uppercase tracking-[0.35em] text-gray-500 mb-2">Our Role</h3>
                    {roleItems.length > 1 ? (
                      <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                        {roleItems.map((role) => (
                          <li key={role}>{role}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-700">
                        {roleItems[0] || currentCaseStudy.our_role}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-8">
                {challengeParagraphs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-display text-sm uppercase tracking-[0.3em] text-gray-500">
                      The Challenge
                    </h3>
                    {challengeParagraphs.map((paragraph, index) => (
                      <p key={`challenge-${index}`} className="text-base text-gray-800 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {solutionParagraphs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-display text-sm uppercase tracking-[0.3em] text-gray-500">
                      The Solution
                    </h3>
                    {solutionParagraphs.map((paragraph, index) => (
                      <p key={`solution-${index}`} className="text-base text-gray-800 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {!challengeParagraphs.length && !solutionParagraphs.length && currentCaseStudy.tagline && (
                  <p className="text-base text-gray-800 leading-relaxed">
                    {currentCaseStudy.tagline}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Media Section - No Container for full-width */} 
      {currentCaseStudy.portfolio_type === 'case_study' ? (
        <section className="w-full pt-4 pb-8">
          <div className="container mx-auto px-4">
            {currentCaseStudy.pdf_url ? (
              <a
                href={currentCaseStudy.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition"
              >
                Download Case Study (PDF)
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">No case study PDF available.</p>
            )}
          </div>
        </section>
      ) : (
        <section className="w-full pt-4 pb-8">
          <PortfolioMediaDisplay
            mediaFiles={(portfolioMedia || [])
              .filter(m => !m.is_cover)
              .map(media => ({
                id: media.id,
                url: media.url,
                type: media.media_type as 'image' | 'video' | 'gif' | 'pdf',
                name: media.file_name
              }))}
          />
        </section>
      )}

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

      {/* Bottom Actions */}
      <div className="w-full bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8 flex flex-row items-center justify-center gap-3 shadow-sm mt-8 overflow-x-auto">
        <PortfolioActions 
          title={currentCaseStudy.title}
          slug={slug || ''}
          variant="bottom"
        />
      </div>

      {/* Floating "About project" button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        {/* Pass the full currentCaseStudy object which now contains all the new details */}
        <ProjectInfoOverlay projectData={currentCaseStudy} />
      </div>
    </div>
  );
}
