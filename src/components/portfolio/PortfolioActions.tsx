import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Share2, Send } from 'lucide-react';

interface PortfolioActionsProps {
  title: string;
  slug: string;
  variant?: 'header' | 'bottom' | 'inline';
  className?: string;
}

export default function PortfolioActions({
  title,
  slug,
  variant = 'inline',
  className = '',
}: PortfolioActionsProps) {
  // Generate the portfolio URL
  const portfolioUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/portfolio/${slug}`
    : `/portfolio/${slug}`;
  
  // Generate contact URL with pre-filled data
  const contactUrl = `/contact?portfolio=${encodeURIComponent(title)}&url=${encodeURIComponent(portfolioUrl)}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ 
          title: `Check out: ${title}`, 
          url: portfolioUrl 
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(portfolioUrl);
        alert('Portfolio link copied to clipboard!');
      }
    } catch (e) {
      // User cancelled or share failed; try clipboard fallback
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(portfolioUrl);
          alert('Portfolio link copied to clipboard!');
        }
      } catch {
        // Final fallback - just show the URL
        prompt('Copy this link:', portfolioUrl);
      }
    }
  };

  // Different styling based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'header':
        return {
          share: "flex items-center gap-1 border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50",
          request: "gold-shimmer text-black px-3 py-1.5 text-xs font-semibold transition-all duration-300 hover:scale-105"
        };
      case 'bottom':
        return {
          share: "bg-white/90 text-black hover:bg-white text-sm px-4 py-2 h-auto flex-shrink-0 font-semibold transition-all duration-300 hover:scale-105",
          request: "gold-shimmer text-black hover:bg-yellow-500 text-sm px-4 py-2 h-auto flex-shrink-0 font-semibold transition-all duration-300 hover:scale-105"
        };
      default:
        return {
          share: "bg-white/90 text-black hover:bg-white text-xs px-3 py-1.5 h-auto",
          request: "gold-shimmer text-black hover:bg-yellow-500 text-xs px-3 py-1.5 h-auto"
        };
    }
  };

  const styles = getButtonStyles();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        onClick={handleShare} 
        variant="outline" 
        size="sm" 
        className={styles.share}
        title="Share this portfolio item"
      >
        <Share2 className="w-3 h-3" /> Share
      </Button>
      
      <Button 
        asChild 
        variant="secondary" 
        size="sm" 
        className={styles.request}
        title="Request this design"
      >
        <Link to={contactUrl}>
          <Send className="w-3 h-3 mr-1 animate-pulse" /> Request
        </Link>
      </Button>
    </div>
  );
}
