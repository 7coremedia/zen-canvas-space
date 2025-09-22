import * as React from 'react';
import PortfolioItem from '@/components/portfolio/PortfolioItem';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { caseStudies } from '@/data/caseStudies';

export default function PortfolioGrid() {

  // Use actual case study data so grid and detail pages stay in sync
  const allPortfolioItems = React.useMemo(
    () =>
      caseStudies.map((c) => ({
        title: c.title,
        category: c.category,
        imageUrl: c.cover,
        slug: c.slug,
      })),
    []
  );

  const filteredItems = allPortfolioItems;

  return (
    <section className="container mx-auto py-12 px-4">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search KING..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-700">
          <span className="font-medium">Projects</span>
          <span>People</span>
          <span>Assets</span>
          <span>Images</span>
          <Button variant="outline" className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4 rotate-90" /> {/* Using SlidersHorizontal for recommended icon */}
            Recommended
          </Button>
        </div>
      </div>



      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {filteredItems.map((item, index) => (
          <PortfolioItem
            key={index}
            title={item.title}
            category={item.category}
            imageUrl={item.imageUrl}
            slug={item.slug}
          />
        ))}
      </div>
    </section>
  );
}
