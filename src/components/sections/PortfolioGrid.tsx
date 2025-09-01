import * as React from 'react';
import PortfolioItem from '@/components/portfolio/PortfolioItem';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function PortfolioGrid() {

  // Placeholder data for portfolio items
  const allPortfolioItems = React.useMemo(() => [
    {
      title: 'RingCentral - AI Expression',
      category: 'Branding',
      imageUrl: '/home/aalux-body-img.png', // Placeholder image
      slug: 'periscope',
    },
    {
      title: 'Reflection',
      category: 'Graphic Design',
      imageUrl: '/home/aalux-bento.png', // Placeholder image
      slug: 'luxury-fashion',
    },
    {
      title: "Open'er 2024",
      category: 'Branding',
      imageUrl: '/home/aalux-resu-in-sea.png', // Placeholder image
      slug: 'minimalist-logo',
    },
    {
      title: 'Kulture',
      category: 'Graphic Design',
      imageUrl: '/home/about-cont.png', // Placeholder image
      slug: 'periscope',
    },
    {
      title: 'Abstract Art',
      category: 'Branding',
      imageUrl: '/home/about-tumb.png', // Placeholder image
      slug: 'luxury-fashion',
    },
    {
      title: 'Digital Painting',
      category: 'Graphic Design',
      imageUrl: '/home/alux-bento-vibe.png', // Placeholder image
      slug: 'minimalist-logo',
    },
    {
      title: 'The People Pleaser',
      category: 'Branding',
      imageUrl: '/home/alux-label.png', // Placeholder image
      slug: 'periscope',
    },
  ], []);

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
