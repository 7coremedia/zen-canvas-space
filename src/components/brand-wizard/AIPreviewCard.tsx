import { Button } from '@/components/ui/button';
import { Wand2, RefreshCw } from 'lucide-react';

type AIPreviewCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  onRegenerate?: () => void;
  className?: string;
};

export function AIPreviewCard({ 
  title, 
  description, 
  children, 
  onRegenerate,
  className = '' 
}: AIPreviewCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {onRegenerate && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRegenerate}
              className="shrink-0"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Regenerate</span>
            </Button>
          )}
        </div>
        
        <div className="mt-4">
          {children}
        </div>
      </div>
      
      <div className="bg-muted/20 px-6 py-3 text-xs text-muted-foreground border-t flex items-center">
        <Wand2 className="h-3 w-3 mr-2 text-primary" />
        <span>AI-generated content based on your description</span>
      </div>
    </div>
  );
}

type ColorSwatchProps = {
  color: string;
  name: string;
  className?: string;
};

export function ColorSwatch({ color, name, className = '' }: ColorSwatchProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div 
        className="w-12 h-12 rounded-lg border shadow-sm mb-1.5"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-medium text-center">{name}</span>
      <span className="text-xs text-muted-foreground font-mono">{color}</span>
    </div>
  );
}

type FontPreviewProps = {
  fontFamily: string;
  title: string;
  description: string;
  className?: string;
};

export function FontPreview({ 
  fontFamily, 
  title, 
  description, 
  className = '' 
}: FontPreviewProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <div 
        className="text-2xl font-medium"
        style={{ fontFamily }}
      >
        {fontFamily}
      </div>
      <p 
        className="text-muted-foreground text-sm"
        style={{ fontFamily }}
      >
        {description}
      </p>
    </div>
  );
}
