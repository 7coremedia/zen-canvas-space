import { Button } from '@/components/ui/button';
import { Settings, RefreshCw } from 'lucide-react';
import { AIPreviewCard } from './AIPreviewCard';

type AIBrandPreviewProps = {
  brandData: {
    name: string;
    description: string;
    colors: Record<string, string>;
    fonts: {
      heading: string;
      body: string;
    };
    logo?: {
      url: string;
      alt: string;
    };
  };
  onEditSection?: (section: string) => void;
  onRegenerate?: (section: string) => void;
  className?: string;
};

export function AIBrandPreview({ 
  brandData, 
  onEditSection, 
  onRegenerate,
  className = '' 
}: AIBrandPreviewProps) {
  const { name, description, colors, fonts, logo } = brandData;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Brand Overview */}
      <AIPreviewCard 
        title="Brand Overview"
        description="AI-generated brand identity based on your description"
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </AIPreviewCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logo Preview */}
        <AIPreviewCard 
          title="Logo Design"
          description="AI-generated logo for your brand"
          onRegenerate={onRegenerate ? () => onRegenerate('logo') : undefined}
        >
          <div className="flex justify-center p-8 bg-muted/20 rounded-lg">
            {logo ? (
              <img 
                src={logo.url} 
                alt={logo.alt}
                className="max-w-full max-h-64 object-contain"
              />
            ) : (
              <div className="text-muted-foreground">No logo generated yet</div>
            )}
          </div>
        </AIPreviewCard>

        {/* Colors Preview */}
        <AIPreviewCard 
          title="Color Palette"
          description="AI-generated color scheme for your brand"
          onRegenerate={onRegenerate ? () => onRegenerate('colors') : undefined}
        >
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(colors || {}).map(([name, color]) => (
              <div key={name} className="flex flex-col items-center">
                <div 
                  className="w-12 h-12 rounded-lg border shadow-sm mb-1.5"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-medium text-center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {color}
                </span>
              </div>
            ))}
          </div>
        </AIPreviewCard>
      </div>

      {/* Typography Preview */}
      <AIPreviewCard 
        title="Typography"
        description="AI-selected fonts for your brand"
        onRegenerate={onRegenerate ? () => onRegenerate('typography') : undefined}
      >
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Heading Font</p>
            <div style={{ fontFamily: fonts.heading }}>
              <h3 className="text-3xl font-bold">Aa Bb Cc</h3>
              <p className="text-muted-foreground">{fonts.heading}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Body Font</p>
            <div style={{ fontFamily: fonts.body }}>
              <p className="text-lg">The quick brown fox jumps over the lazy dog</p>
              <p className="text-muted-foreground">{fonts.body}</p>
            </div>
          </div>
        </div>
      </AIPreviewCard>
    </div>
  );
}
