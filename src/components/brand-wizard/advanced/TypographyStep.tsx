import { Button } from '@/components/ui/button';
import { RefreshCw, Type } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Manrope', value: 'Manrope, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Open Sans', value: '\'Open Sans\', sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
];

type TypographyStepProps = {
  data: {
    typography: {
      fontFamily: string;
      baseSize: string;
      scaleRatio: number;
    };
  };
  onDataChange: (data: any) => void;
};

export function TypographyStep({ data, onDataChange }: TypographyStepProps) {
  const handleTypographyChange = (key: keyof typeof data.typography, value: string | number) => {
    onDataChange({
      ...data,
      typography: {
        ...data.typography,
        [key]: value
      }
    });
  };

  const handleRegenerate = () => {
    // In a real app, this would call an AI service
    const randomTypography = {
      fontFamily: FONT_OPTIONS[Math.floor(Math.random() * FONT_OPTIONS.length)].value,
      baseSize: `${Math.floor(Math.random() * 8) + 12}px`,
      scaleRatio: Math.random() * 0.4 + 1.1,
    };
    onDataChange({
      ...data,
      typography: randomTypography
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Typography</h2>
        <p className="text-sm text-muted-foreground">
          Customize your brand's typography settings
        </p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="fontFamily">Primary Font</Label>
            <Select
              value={data.typography.fontFamily}
              onValueChange={(value) => handleTypographyChange('fontFamily', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((font) => (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                  >
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="baseSize">Base Font Size</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="baseSize"
                  type="number"
                  min="12"
                  max="24"
                  value={parseInt(data.typography.baseSize) || 16}
                  onChange={(e) => handleTypographyChange('baseSize', e.target.value + 'px')}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">px</span>
              </div>
            </div>

            <div>
              <Label htmlFor="scaleRatio">Scale Ratio</Label>
              <Input
                id="scaleRatio"
                type="number"
                step="0.1"
                min="1.1"
                max="1.5"
                value={data.typography.scaleRatio}
                onChange={(e) => handleTypographyChange('scaleRatio', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-muted/20">
          <h3 className="text-sm font-medium mb-3">Preview</h3>
          <div className="space-y-4" style={{ fontFamily: data.typography.fontFamily }}>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Display</div>
              <div 
                className="text-3xl md:text-4xl font-bold"
                style={{ fontSize: `calc(${data.typography.baseSize} * ${Math.pow(data.typography.scaleRatio, 4)})` }}
              >
                The quick brown fox jumps
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Heading</div>
              <div 
                className="text-xl md:text-2xl font-semibold"
                style={{ fontSize: `calc(${data.typography.baseSize} * ${Math.pow(data.typography.scaleRatio, 2)})` }}
              >
                The quick brown fox jumps
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Body</div>
              <p 
                className="leading-relaxed"
                style={{ fontSize: data.typography.baseSize }}
              >
                The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!
              </p>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Small</div>
              <div 
                className="text-sm opacity-80"
                style={{ fontSize: `calc(${data.typography.baseSize} / ${data.typography.scaleRatio})` }}
              >
                The quick brown fox jumps over the lazy dog.
              </div>
            </div>
          </div>
        </div>
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
  );
}
