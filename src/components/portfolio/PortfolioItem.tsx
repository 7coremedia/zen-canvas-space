import * as React from 'react';
import { cn } from '@/lib/utils';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
  slug,
}: PortfolioItemProps) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <Link
      to={`/portfolio/${slug}`}
      className="relative group block select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/60 rounded-2xl"
    >
      {/* Media container with rounded corners (non-interactive) */}
      <div className="relative w-full bg-gray-100 rounded-2xl overflow-hidden">
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
            "block w-full h-auto object-top transition-opacity duration-500 pointer-events-none",
            loaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          draggable={false}
        />
        {/* Dark transparent overlay on hover (visual only) */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-end p-4 pointer-events-none opacity-0 group-hover:opacity-100">
          <div className="flex w-full justify-end items-center">
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/90 text-black hover:bg-white w-8 h-8 rounded-full pointer-events-none"
              disabled
              title="Project item actions disabled"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="font-display text-base font-medium leading-tight">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{category}</p>
      </div>
    </Link>
  );
}
