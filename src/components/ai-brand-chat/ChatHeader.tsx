import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onHumanHelp?: () => void;
  onToggleSidePanel?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onHumanHelp, onToggleSidePanel }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleHumanHelp = () => {
    if (onHumanHelp) {
      onHumanHelp();
    } else {
      // Default behavior - navigate to contact
      navigate('/contact');
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white relative">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
        >
          <img 
            src="/back-icon-chat-pg.svg" 
            alt="Back" 
            width="16" 
            height="16"
          />
        </Button>
        
        {/* Two-line Hamburger Menu */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidePanel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
        >
          <div className="flex flex-col gap-1">
            <div className="w-4 h-0.5 bg-gray-600 rounded-full"></div>
            <div className="w-4 h-0.5 bg-gray-600 rounded-full"></div>
          </div>
        </Button>
        
        {/* Logo - Left on mobile, centered on desktop */}
        <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-x-4">
          <img 
            src="/favicon.svg" 
            alt="KING Logo" 
            width="32" 
            height="32"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="gold"
          size="sm"
          onClick={handleHumanHelp}
          className="px-4 py-2 font-medium transition-all duration-200 hover:scale-105 z-10 rounded-lg"
        >
          Human Help
        </Button>
      </div>
    </header>
  );
};
