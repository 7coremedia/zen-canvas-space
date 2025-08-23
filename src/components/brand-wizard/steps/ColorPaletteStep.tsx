import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { HexColorPicker } from 'react-colorful';
import { Copy, RefreshCw, Palette, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

type ColorPalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
  [key: string]: string; // For dynamic access
};

type ColorPaletteStepProps = {
  data: {
    colors?: ColorPalette;
    colorMode?: 'light' | 'dark' | 'system';
    contrastRatio?: number;
  };
  onDataChange: (data: any) => void;
  isAdvancedOpen?: boolean;
  onToggleAdvanced?: () => void;
};

export function ColorPaletteStep({ 
  data, 
  onDataChange, 
  isAdvancedOpen = false, 
  onToggleAdvanced 
}: ColorPaletteStepProps) {
  const [activeColor, setActiveColor] = useState<keyof ColorPalette>('primary');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const colors = data.colors || {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#f43f5e',
    background: '#ffffff',
    text: '#1f2937',
    muted: '#6b7280',
  };

  const handleColorChange = (color: string) => {
    onDataChange({
      ...data,
      colors: {
        ...colors,
        [activeColor]: color
      }
    });
  };

  const generatePalette = useCallback(async () => {
    setIsGenerating(true);
    
    // Simulate AI palette generation
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This would come from your AI service in a real app
      const generatedPalette = {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        background: '#ffffff',
        text: '#1f2937',
        muted: '#6b7280',
      };
      
      onDataChange({
        ...data,
        colors: generatedPalette
      });
      
      toast({
        title: 'New palette generated!',
        description: 'AI has created a harmonious color palette for your brand.',
      });
    } catch (error) {
      console.error('Error generating palette:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate color palette. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [data, onDataChange]);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({
      title: 'Copied!',
      description: `${color} copied to clipboard`,
    });
  };

  const colorTypes = [
    { id: 'primary', name: 'Primary', description: 'Main brand color' },
    { id: 'secondary', name: 'Secondary', description: 'Accent color' },
    { id: 'accent', name: 'Accent', description: 'Highlight color' },
    { id: 'background', name: 'Background', description: 'Page background' },
    { id: 'text', name: 'Text', description: 'Main text color' },
    { id: 'muted', name: 'Muted', description: 'Secondary text' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Main Content Area - Takes available space */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Color Palette Grid - Left Side */}
        <div className="lg:w-1/2 xl:w-2/5 flex flex-col">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 flex-1">
            {colorTypes.map(({ id, name }) => (
              <div 
                key={id}
                className={cn(
                  'rounded-xl p-4 sm:p-5 cursor-pointer transition-all flex flex-col',
                  activeColor === id 
                    ? 'ring-2 ring-offset-2 ring-primary shadow-md' 
                    : 'hover:ring-1 hover:ring-border hover:shadow-sm',
                  'h-28 sm:h-32 xl:h-36'
                )}
                style={{ backgroundColor: colors[id] }}
                onClick={() => setActiveColor(id as keyof ColorPalette)}
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      'text-sm font-medium line-clamp-1',
                      ['background', 'muted'].includes(id) ? 'text-foreground' : 'text-white'
                    )}>
                      {name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(colors[id]);
                      }}
                      className={cn(
                        'p-1.5 rounded-md hover:bg-black/10 transition-colors',
                        ['background', 'muted'].includes(id) ? 'text-foreground/80' : 'text-white/80',
                        'opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none',
                        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary'
                      )}
                      aria-label={`Copy ${name} color`}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className={cn(
                    'text-xs font-mono mt-auto pt-2',
                    ['background', 'muted'].includes(id) ? 'text-foreground/80' : 'text-white/80',
                    'truncate'
                  )}>
                    {colors[id]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Generate with AI Button - At bottom of color grid on desktop */}
          <div className="mt-4 hidden lg:block">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={generatePalette}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Palette className="mr-2 h-4 w-4" />
                  Generate with AI
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Color Picker - Right Side */}
        <div className="lg:flex-1 flex flex-col bg-card rounded-xl p-4 sm:p-6 shadow-sm border">
          <div className="space-y-6 h-full flex flex-col">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">
                {colorTypes.find(c => c.id === activeColor)?.name} Color
              </h2>
              <p className="text-muted-foreground text-sm">
                {colorTypes.find(c => c.id === activeColor)?.description}
              </p>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                <div className="lg:w-1/2 xl:w-3/5 flex flex-col">
                  <div className="aspect-square max-h-[300px] lg:max-h-none lg:flex-1 rounded-lg overflow-hidden border">
                    <HexColorPicker
                      color={colors[activeColor]}
                      onChange={handleColorChange}
                      className="w-full h-full"
                    />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label>Color Value</Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          type="text"
                          value={colors[activeColor]}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className="font-mono text-sm pr-10"
                        />
                        <div 
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded border"
                          style={{ backgroundColor: colors[activeColor] }}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                          handleColorChange(randomColor);
                        }}
                        className="shrink-0"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(colors[activeColor])}
                        className="shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Color Preview - Right side on desktop */}
                <div className="lg:w-1/2 xl:w-2/5 flex flex-col gap-4 mt-4 lg:mt-0">
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div 
                      className="rounded-lg p-6 h-32 flex items-center justify-center text-center"
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text
                      }}
                    >
                      <div>
                        <div className="font-medium">Sample Text</div>
                        <div className="text-sm opacity-80">
                          {activeColor === 'background' ? 'Background' : 'Preview'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="default"
                      className="h-auto py-2"
                      style={{
                        backgroundColor: colors.primary,
                        color: getContrastColor(colors.primary)
                      }}
                    >
                      Primary
                    </Button>
                    <Button 
                      variant="secondary"
                      className="h-auto py-2"
                      style={{
                        backgroundColor: colors.secondary,
                        color: getContrastColor(colors.secondary)
                      }}
                    >
                      Secondary
                    </Button>
                  </div>
                </div>
              </div>

              {/* Generate with AI Button - Only visible on mobile */}
              <div className="mt-6 lg:hidden">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={generatePalette}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Palette className="mr-2 h-4 w-4" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings - Full width at bottom */}
      <div className="border-t pt-4">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="w-full flex items-center justify-between text-sm"
          onClick={onToggleAdvanced}
        >
          <span>Advanced Settings</span>
          {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {isAdvancedOpen && (
          <div className="mt-4 space-y-6 p-4 bg-muted/30 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Color Mode</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['light', 'dark', 'system'].map((mode) => (
                    <Button
                      key={mode}
                      type="button"
                      variant={data.colorMode === mode ? 'default' : 'outline'}
                      size="sm"
                      className="capitalize"
                      onClick={() => onDataChange({ ...data, colorMode: mode })}
                    >
                      {mode}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Contrast Ratio</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {data.contrastRatio || 4.5}:1
                  </span>
                </div>
                <Slider
                  value={[data.contrastRatio || 4.5]}
                  min={3}
                  max={7}
                  step={0.1}
                  onValueChange={([value]) => onDataChange({ ...data, contrastRatio: value })}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low Contrast</span>
                  <span className="flex items-center gap-1">
                    {data.contrastRatio && data.contrastRatio >= 4.5 ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-amber-600">⚠</span>
                    )}
                    WCAG AA Compliant
                  </span>
                  <span>High Contrast</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to determine text color based on background
function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
