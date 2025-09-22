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
  const [loaded, setLoaded] = React.useState(false);
  return (
    <div className="relative group overflow-hidden rounded-lg">
      <Link to={`/portfolio/${slug}`} className="block"> {/* Use actual slug here */}
        {/* Fixed aspect ratio container. Adjust aspect if desired, e.g., aspect-[16/9] */}
        <div className="relative w-full aspect-[16/9] bg-gray-100">
          {/* Skeleton */}
          <div
            className={cn(
              "absolute inset-0 animate-pulse bg-gray-200",
              loaded && "hidden"
            )}
          />
          <img
            src={imageUrl}
            alt={title}
            className={cn(
              "w-full h-full object-cover object-top transition-opacity duration-500",
              loaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
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
