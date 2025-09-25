import { Button } from '@/components/ui/button';
import { Bookmark, Plus } from 'lucide-react';
import PortfolioActions from '@/components/portfolio/PortfolioActions';

interface SinglePartnerHeaderProps {
  title: string;
  partnerName: string;
  partnerType?: string; // e.g., "By KING"
  slug: string;
}

export default function SinglePartnerHeader({
  title,
  partnerName,
  partnerType = "By KING",
  slug,
}: SinglePartnerHeaderProps) {
  return (
         <div className="w-full bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between shadow-sm sticky top-0 z-20">
       <div className="flex items-center gap-4">
         {/* Partner/Profile Info */}
         <div className="flex items-center gap-2">
           {/* Placeholder for partner avatar */}
           <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
           <div className="flex flex-col text-sm">
             <span className="font-medium">{partnerName}</span>
             <span className="text-gray-500">{partnerType}</span>
           </div>
         </div>
         
         {/* Simple Follow Button */}
         <Button 
           variant="outline" 
           className="border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1"
         >
           <Plus className="w-3 h-3" /> 
           Follow
         </Button>
       </div>

       {/* Action buttons on the right */}
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
