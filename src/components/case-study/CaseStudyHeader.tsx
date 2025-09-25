import { Button } from '@/components/ui/button';
import { Bookmark, Plus } from 'lucide-react';
import PortfolioActions from '@/components/portfolio/PortfolioActions';

interface CaseStudyHeaderProps {
  title: string;
  owner: string;
  slug: string;
}

export default function CaseStudyHeader({
  title,
  owner,
  slug,
}: CaseStudyHeaderProps) {
  return (
    <div className="w-full bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Owner/Profile Info - Simplified for now */}
        <div className="flex items-center gap-2">
          {/* Placeholder for owner avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
          <div className="flex flex-col text-sm">
            <span className="font-medium">{owner}</span>
            <span className="text-gray-500">Multiple Owners</span> {/* Placeholder for now */}
          </div>
        </div>
        <Button variant="outline" className="border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
          <Plus className="w-3 h-3 mr-1" /> Follow All
        </Button>
      </div>

      <div className="flex-1 text-center md:text-left md:ml-8 mt-2 md:mt-0">
        <h1 className="text-lg font-semibold truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 mt-4 md:mt-0">
        <Button variant="outline" size="sm" className="flex items-center gap-1 border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
          <Bookmark className="w-3 h-3" /> Save
        </Button>
        <PortfolioActions 
          title={title} 
          slug={slug} 
          variant="header" 
        />
      </div>
    </div>
  );
}
