import * as React from 'react';
import { useState } from 'react';
import PortfolioItem from '@/components/portfolio/PortfolioItem';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePublicPortfolio } from '@/hooks/usePublicPortfolio';
import { AnimatePresence, motion } from 'framer-motion';

export default function PortfolioGrid() {
  const { data: portfolioItems, isLoading, error } = usePublicPortfolio();
  const [tab, setTab] = useState<'portfolio' | 'case_studies' | 'research_docs'>('portfolio');

  console.debug('PortfolioGrid items:', portfolioItems);
  const allItems = Array.isArray(portfolioItems)
    ? portfolioItems
        .filter((i) => i && i.title && i.category && i.cover_url && i.slug)
        .map((item) => ({
          title: String(item.title),
          category: String(item.category),
          imageUrl: String(item.cover_url),
          slug: String(item.slug),
          portfolio_type: String((item as any).portfolio_type || 'gallery'),
        }))
    : [];
  const caseStudyItems = allItems.filter((i) => i.portfolio_type === 'case_study');

  if (isLoading) {
    return (
      <section className="container mx-auto py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto py-12 px-4">
        <div className="text-center">
          <p className="text-red-500">Error loading portfolio items</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-12 px-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        {/* Top Bar: Tabs on left, suggestions on right */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <TabsList
              className="inline-flex flex-shrink-0 gap-1 rounded-3xl bg-gray-100 p-1.5 sm:p-1 mx-1.5 sm:mx-0"
            >
              <TabsTrigger
                value="portfolio"
                className="rounded-3xl w-[6.75rem] sm:w-36 justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition"
              >
                Portfolio
              </TabsTrigger>
              <TabsTrigger
                value="case_studies"
                className="rounded-3xl w-[6.75rem] sm:w-36 justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition"
              >
                <span className="sm:hidden">Case Study</span>
                <span className="hidden sm:inline">Case Study Files</span>
              </TabsTrigger>
              <TabsTrigger
                value="research_docs"
                className="rounded-3xl w-[6.75rem] sm:w-36 justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition"
              >
                <span className="sm:hidden">Research</span>
                <span className="hidden sm:inline">Research Docs</span>
              </TabsTrigger>
            </TabsList>

            {/* Suggestions (right side) */}
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-700 whitespace-nowrap">
              <span className="font-medium">Projects</span>
              <span>People</span>
              <span>Assets</span>
              <span>Images</span>
              <Button
                variant="outline"
                className="rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Recommended
              </Button>
            </div>
          </div>
        </div>

        {/* Content below the fixed top bar with Framer Motion transitions */}
        <div className="mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.6 }}
            >
              {tab === 'portfolio' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {allItems.map((item, index) => (
                    <PortfolioItem
                      key={index}
                      title={item.title}
                      category={item.category}
                      imageUrl={item.imageUrl}
                      slug={item.slug}
                    />
                  ))}
                </div>
              )}

              {tab === 'case_studies' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {caseStudyItems.map((item, index) => (
                    <PortfolioItem
                      key={index}
                      title={item.title}
                      category={item.category}
                      imageUrl={item.imageUrl}
                      slug={item.slug}
                    />
                  ))}
                </div>
              )}

              {tab === 'research_docs' && (
                <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-700 bg-white">
                  <h3 className="text-xl font-semibold mb-2">Research Docs – Coming Soon</h3>
                  <p className="text-sm text-gray-500">You’ll be able to see behind-the-scenes docs for select projects here.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    </section>
  );
}
