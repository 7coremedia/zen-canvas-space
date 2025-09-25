import * as React from 'react';
import PortfolioItem from '@/components/portfolio/PortfolioItem';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePublicPortfolio } from '@/hooks/usePublicPortfolio';

export default function PortfolioGrid() {
  const { data: portfolioItems, isLoading, error } = usePublicPortfolio();

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
      <Tabs defaultValue="case_studies" className="w-full mb-8">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="case_studies">Case Study Files</TabsTrigger>
          <TabsTrigger value="research_docs">Research Docs</TabsTrigger>
        </TabsList>

        <TabsContent value="case_studies">
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
        </TabsContent>

        <TabsContent value="research_docs">
          <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-700 bg-white">
            <h3 className="text-xl font-semibold mb-2">Research Docs – Coming Soon</h3>
            <p className="text-sm text-gray-500">You’ll be able to see behind-the-scenes docs for select projects here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
