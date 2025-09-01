import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Brain } from 'lucide-react';

interface ThinkingPanelProps {
  /** Whether to show the thinking animation */
  show: boolean;
  /** Optional className for styling */
  className?: string;
  /** Duration of the thinking animation in milliseconds (default: 2000ms) */
  duration?: number;
}

/**
 * ThinkingPanel Component
 * 
 * Shows animated "AI is thinking..." indicator when show=true.
 * Non-blocking - user can still type while thinking is displayed.
 * Auto-hides after specified duration or when show becomes false.
 * 
 * Props:
 * - show: Whether to display the thinking animation
 * - className: Optional styling classes
 * - duration: Animation duration in ms (default: 2000ms)
 */
export const ThinkingPanel: React.FC<ThinkingPanelProps> = ({ 
  show, 
  className,
  duration = 2000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dots, setDots] = useState('');

  // Handle show/hide logic
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, duration]);

  // Animate dots
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-4",
        "bg-muted/50 border rounded-lg",
        "animate-in fade-in duration-300",
        className
      )}
    >
      <div className="flex items-center justify-center w-8 h-8">
        <Brain className="w-5 h-5 text-primary animate-pulse" />
      </div>
      
      <div className="flex-1">
        <p className="text-sm text-muted-foreground font-medium">
          AI is thinking{dots}
        </p>
        <p className="text-xs text-muted-foreground">
          You can continue typing while I process...
        </p>
      </div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
    </div>
  );
};

// Add shimmer animation to global styles if needed
const shimmerStyles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const styleId = 'thinking-panel-shimmer';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = shimmerStyles;
    document.head.appendChild(style);
  }
}

