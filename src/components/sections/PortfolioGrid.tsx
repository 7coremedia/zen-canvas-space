import * as React from 'react';
import { useState } from 'react';
import PortfolioItem from '@/components/portfolio/PortfolioItem';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePublicPortfolio } from '@/hooks/usePublicPortfolio';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const FALLBACK_PREVIEW_ITEMS = [
  {
    title: 'National Gallery of Art',
    summary: 'Brand identity and experiential signage concepts for a cultural landmark.',
  },
  {
    title: 'Chatsworth',
    summary: 'Heritage campaign posters and storytelling visuals for a luxury estate.',
  },
  {
    title: 'Liberty',
    summary: 'Seasonal fashion creative exploring typography and editorial layouts.',
  },
  {
    title: 'Mastercard',
    summary: 'Digital-first motion frames highlighting simplicity and connectivity.',
  },
  {
    title: 'AfroHaus',
    summary: 'Immersive launch graphics inspired by African futurism.',
  },
  {
    title: 'Kora Studio',
    summary: 'Minimalist UI tiles and product visuals for a design collective.',
  },
];

export default function PortfolioGrid() {
  const { data: portfolioItems, isLoading, error } = usePublicPortfolio();
  const [tab, setTab] = useState<'portfolio' | 'case_studies' | 'research_docs' | 'collections'>('portfolio');

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
          summary: String((item as any).tagline || (item as any).short_description || item.category || 'Creative collaboration'),
        }))
    : [];
  const caseStudyItems = allItems.filter((i) => i.portfolio_type === 'case_study');
  const collectionRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const basePreviewItems = React.useMemo(() => {
    if (allItems.length > 0) {
      return allItems.map((item) => ({
        title: item.title,
        summary: item.summary || item.category || 'Creative collaboration',
      }));
    }
    return FALLBACK_PREVIEW_ITEMS;
  }, [allItems]);

  const placeholderCollections = React.useMemo(() => {
    const source = basePreviewItems.length > 0 ? basePreviewItems : FALLBACK_PREVIEW_ITEMS;
    const total = source.length;
    const itemsPerCollection = 10;

    const buildItems = (offset: number) =>
      Array.from({ length: itemsPerCollection }, (_, idx) => {
        const reference = source[(offset + idx) % total];
        return {
          title: reference.title,
          summary: reference.summary,
        };
      });

    const secondOffset = total > 5 ? 5 : Math.floor(total / 2);

    return [
      {
        title: 'Ad Posters',
        id: 'ad-posters',
        items: buildItems(0),
      },
      {
        title: 'Video Design',
        id: 'video-design',
        items: buildItems(secondOffset),
      },
    ];
  }, [basePreviewItems]);

  const scrollCollection = (index: number, direction: 'prev' | 'next') => {
    const container = collectionRefs.current[index];
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    const delta = direction === 'next' ? scrollAmount : -scrollAmount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
  };

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
          <div className="flex items-center justify-center md:justify-between">
            <TabsList
              className="inline-flex h-auto flex-shrink-0 items-center justify-center gap-1 rounded-full bg-gray-100 p-1.5 sm:p-1 mx-3 sm:mx-0"
            >
              <TabsTrigger
                value="portfolio"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm sm:w-32"
              >
                Portfolio
              </TabsTrigger>
              <TabsTrigger
                value="case_studies"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm sm:w-36"
              >
                <span className="sm:hidden">Case Study</span>
                <span className="hidden sm:inline">Case Study Files</span>
              </TabsTrigger>
              <TabsTrigger
                value="research_docs"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm sm:w-32"
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
                className={cn(
                  "rounded-full border border-gray-300 px-4 py-2 text-gray-700 transition-colors",
                  tab === 'collections'
                    ? 'bg-black text-white border-black hover:bg-black/90'
                    : 'hover:bg-gray-50'
                )}
                onClick={() => setTab('collections')}
              >
                Collections
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
                <div className="rounded-3xl border border-gray-200 p-8 text-center text-gray-700 bg-white">
                  <h3 className="text-xl font-semibold mb-2">Research Docs – Coming Soon</h3>
                  <p className="text-sm text-gray-500">You’ll be able to see behind-the-scenes docs for select projects here.</p>
                </div>
              )}

              {tab === 'collections' && (
                <div className="space-y-12">
                  {placeholderCollections.map((collection, index) => (
                    <section key={collection.id} className="relative">
                      <div className="flex items-baseline justify-between gap-4 mb-6">
                        <h3 className="font-display text-2xl font-medium text-gray-900">
                          {collection.title}
                        </h3>
                        <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                          10 previews
                        </span>
                      </div>
                      <div className="relative">
                        <div
                          ref={(el) => {
                            collectionRefs.current[index] = el;
                          }}
                          className="flex gap-5 overflow-x-auto overflow-y-visible pb-4 snap-x snap-mandatory pr-4 scrollbar-hidden"
                        >
                          {collection.items.map((item, itemIndex) => (
                            <div
                              key={`${collection.id}-${itemIndex}`}
                              className="relative z-10 flex-shrink-0 w-52 sm:w-60 md:w-72 snap-center"
                            >
                              <div className="group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-lg shadow-lg shadow-black/20 ring-1 ring-black/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#f2f2f2] via-[#e4e4e4] to-[#f7f7f7]" aria-hidden="true" />

                                <div className="absolute inset-0">
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
                                </div>

                                <div className="relative z-10 mt-auto flex flex-col gap-3 px-4 pb-5 pt-32">
                                  <div className="space-y-1">
                                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/70">
                                      {collection.title}
                                    </p>
                                    <h4 className="text-base font-semibold text-white">
                                      {item.title}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-white/80 leading-relaxed line-clamp-4">
                                    {item.summary}
                                  </p>
                                </div>

                                <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/10" />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-gray-300"
                            onClick={() => scrollCollection(index, 'prev')}
                          >
                            Prev
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-gray-300"
                            onClick={() => scrollCollection(index, 'next')}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    </section>
  );
}
