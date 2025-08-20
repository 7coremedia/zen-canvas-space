import * as React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PortfolioItemProps {
  title: string;
  category: string;
  imageUrl: string;
  slug: string; // Add slug to props
}

export default function PortfolioItem({
  title,
  category,
  imageUrl,
  slug, // Destructure slug
}: PortfolioItemProps) {
  return (
    <div className="relative group overflow-hidden rounded-lg">
      <Link to={`/portfolio/${slug}`} className="block"> {/* Use actual slug here */}
        <div className="relative w-full h-auto aspect-[4/3] bg-gray-100">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            style={{ height: 'auto' }}
          />
          {/* Dark transparent overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-end p-4 opacity-0 group-hover:opacity-100">
            {/* Buttons on hover */}
            <div className="flex w-full justify-between items-center">
              <Button variant="secondary" className="bg-white/90 text-black hover:bg-white text-xs px-3 py-1.5 h-auto">
                Get started
              </Button>
              <div className="flex space-x-2">
                <Button variant="secondary" size="icon" className="bg-white/90 text-black hover:bg-white w-8 h-8 rounded-full">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="mt-3">
        <h3 className="font-display text-base font-medium leading-tight">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{category}</p>
      </div>
    </div>
  );
}
