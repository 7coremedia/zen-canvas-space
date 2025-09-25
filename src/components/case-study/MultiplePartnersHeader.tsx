import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Plus, ChevronDown } from 'lucide-react';
import PortfolioActions from '@/components/portfolio/PortfolioActions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Partner {
  id: string;
  name: string;
  socialName: string;
  imageUrl?: string;
  socialLink?: string;
}

interface MultiplePartnersHeaderProps {
  title: string;
  brandName: string;
  partners: Partner[];
  slug: string;
}

export default function MultiplePartnersHeader({
  title,
  brandName,
  partners,
  slug,
}: MultiplePartnersHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
         <div className="w-full bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between shadow-sm sticky top-0 z-20">
       <div className="flex items-center gap-4">
         {/* Brand/Profile Info */}
         <div className="flex items-center gap-2">
           {/* Placeholder for brand avatar */}
           <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
           <div className="flex flex-col text-sm">
             <span className="font-medium">{brandName}</span>
             <span className="text-gray-500">Multiple Partners</span>
           </div>
         </div>
         
         {/* Follow All Button with Dropdown */}
         <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
           <DropdownMenuTrigger asChild>
             <Button 
               variant="outline" 
               className="border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1"
             >
               <Plus className="w-3 h-3" /> 
               Follow All
               <ChevronDown className="w-3 h-3 ml-1" />
             </Button>
           </DropdownMenuTrigger>
                                                                                                                       <DropdownMenuContent 
               align="start" 
               className="w-auto min-w-[160px] max-h-80 overflow-y-auto rounded-3xl border border-gray-200 shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
               sideOffset={8}
             >
               {partners.map((partner) => (
                 <DropdownMenuItem 
                   key={partner.id} 
                   className="flex items-center gap-1 py-0.5 px-1.5 hover:bg-gray-50 rounded-[20px] mx-0.25 transition-all duration-200 ease-out cursor-pointer"
                   onClick={() => {
                     if (partner.socialLink) {
                       // Check if it's a social media link and format it properly
                       let url = partner.socialLink;
                       
                       // Handle different social media platforms
                       if (partner.socialName.toLowerCase().includes('instagram') || partner.socialName.toLowerCase().includes('ig')) {
                         if (!url.startsWith('http')) {
                           url = `https://instagram.com/${url.replace('@', '')}`;
                         }
                       } else if (partner.socialName.toLowerCase().includes('whatsapp')) {
                         if (!url.startsWith('http')) {
                           url = `https://wa.me/${url.replace(/\D/g, '')}`;
                         }
                       } else if (partner.socialName.toLowerCase().includes('twitter') || partner.socialName.toLowerCase().includes('x')) {
                         if (!url.startsWith('http')) {
                           url = `https://twitter.com/${url.replace('@', '')}`;
                         }
                       } else if (partner.socialName.toLowerCase().includes('linkedin')) {
                         if (!url.startsWith('http')) {
                           url = `https://linkedin.com/in/${url.replace('@', '')}`;
                         }
                       } else if (!url.startsWith('http')) {
                         url = `https://${url}`;
                       }
                       
                       window.open(url, '_blank', 'noopener,noreferrer');
                     }
                   }}
                 >
                   <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center">
                     {partner.imageUrl ? (
                       <img 
                         src={partner.imageUrl} 
                         alt={partner.name}
                         className="w-full h-full rounded-full object-cover"
                       />
                     ) : (
                       <img 
                         src="/ig-img-place.svg" 
                         alt="Placeholder"
                         className="w-7 h-7 opacity-50"
                       />
                     )}
                   </div>
                   <div className="flex flex-col min-w-0 flex-1">
                     <span className="font-medium text-xs truncate">{partner.name}</span>
                     <span className="text-xs text-gray-500 truncate">{partner.socialName}</span>
                   </div>
                 </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
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
