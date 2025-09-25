import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bookmark, Share2, Send, Plus } from 'lucide-react';

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
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const contactHref = `/contact?portfolio=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl || `/portfolio/${slug}`)}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: shareUrl });
      } else if (navigator.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard');
      }
    } catch (e) {
      // User cancelled or share failed; try clipboard fallback
      try {
        if (navigator.clipboard && shareUrl) {
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard');
        }
      } catch {}
    }
  };
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
        <Button onClick={handleShare} variant="outline" size="sm" className="flex items-center gap-1 border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
          <Share2 className="w-3 h-3" /> Share
        </Button>
        <Button asChild variant="secondary" size="sm" className="gold-shimmer text-black px-3 py-1.5 text-xs font-semibold transition-all duration-300 hover:scale-105">
          <Link to={contactHref}>
            <Send className="w-3 h-3 mr-1 animate-pulse" /> Request
          </Link>
        </Button>
      </div>
    </div>
  );
}
