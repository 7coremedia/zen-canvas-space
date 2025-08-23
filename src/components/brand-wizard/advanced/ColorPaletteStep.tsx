import { Button } from '@/components/ui/button';
import { RefreshCw, Palette } from 'lucide-react';

type ColorPaletteStepProps = {
  data: {
    colors: Record<string, string>;
  };
  onDataChange: (data: any) => void;
};

export function ColorPaletteStep({ data, onDataChange }: ColorPaletteStepProps) {
  const handleColorChange = (colorName: string, value: string) => {
    onDataChange({
      ...data,
      colors: {
        ...data.colors,
        [colorName]: value
      }
    });
  };

  const handleRegenerate = () => {
    // In a real app, this would call an AI service
    const newColors = {
      primary: '#' + Math.floor(Math.random()*16777215).toString(16),
      secondary: '#' + Math.floor(Math.random()*16777215).toString(16),
      accent: '#' + Math.floor(Math.random()*16777215).toString(16),
      background: '#FFFFFF',
      text: '#1F2937',
      muted: '#6B7280',
    };
    onDataChange({
      ...data,
      colors: newColors
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Color Palette</h3>
          <p className="text-sm text-muted-foreground">
            Customize your brand colors
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRegenerate}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Regenerate
        </Button>
      </div>

      <div className="space-y-4">
        {Object.entries(data.colors || {}).map(([name, color]) => (
          <div key={name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-md border"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(name, e.target.value)}
                className="w-8 h-8 rounded border"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const newColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                  handleColorChange(name, newColor);
                }}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Random
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
