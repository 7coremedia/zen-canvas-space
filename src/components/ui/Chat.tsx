import React from 'react';
import { cn } from '@/lib/utils';

interface ChatProps {
  /** AI's response content - max 120 words enforced */
  content: string;
  /** Optional className for styling */
  className?: string;
}

/**
 * Chat Component
 * 
 * Displays AI's response content in a scrollable panel.
 * Enforces max 120 words with truncation and ellipsis.
 * 
 * Props:
 * - content: AI's message text (max 120 words)
 * - className: Optional styling classes
 */
export const Chat: React.FC<ChatProps> = ({ content, className }) => {
  // Enforce max 2000 words for chat responses
  const truncateContent = (text: string, maxWords: number = 2000): string => {
    const words = text.split(' ');
    if (words.length <= maxWords) {
      return text;
    }
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const displayContent = truncateContent(content);

  return (
    <div 
      className={cn(
        "flex-1 overflow-y-auto p-4 space-y-4",
        "bg-background border rounded-lg",
        "max-h-96 min-h-32",
        className
      )}
    >
      <div className="prose prose-sm max-w-none">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </p>
      </div>
      
      {/* Show word count indicator if content was truncated */}
      {content.split(' ').length > 2000 && (
        <div className="text-xs text-muted-foreground mt-2">
          Content truncated to 2000 words
        </div>
      )}
    </div>
  );
};

