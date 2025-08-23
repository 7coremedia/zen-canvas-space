import { useState, useEffect } from 'react';
import { Type, Bold, Italic, Underline, Heading1, Heading2, Heading3, Text, List, ListOrdered, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FontFamily = {
  id: string;
  name: string;
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';
  weights: number[];
  variable?: boolean;
};

type FontVariant = 'heading' | 'body' | 'display';

type TypographySettings = {
  fontFamily: string;
  variants: {
    [key in FontVariant]: {
      fontFamily: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing: number;
      fontSize: number;
    };
  };
};

const FONT_FAMILIES: FontFamily[] = [
  // Sans-serif
  { id: 'inter', name: 'Inter', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], variable: true },
  { id: 'figtree', name: 'Figtree', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800, 900], variable: true },
  { id: 'plus-jakarta-sans', name: 'Plus Jakarta Sans', category: 'sans-serif', weights: [200, 300, 400, 500, 600, 700, 800] },
  { id: 'outfit', name: 'Outfit', category: 'sans-serif', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  
  // Serif
  { id: 'lora', name: 'Lora', category: 'serif', weights: [400, 500, 600, 700], variable: true },
  { id: 'playfair-display', name: 'Playfair Display', category: 'serif', weights: [400, 500, 600, 700, 800, 900] },
  { id: 'crimson-pro', name: 'Crimson Pro', category: 'serif', weights: [200, 300, 400, 500, 600, 700, 800, 900], variable: true },
  
  // Display
  { id: 'bebas-neue', name: 'Bebas Neue', category: 'display', weights: [400] },
  { id: 'montserrat', name: 'Montserrat', category: 'display', weights: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  
  // Handwriting
  { id: 'caveat', name: 'Caveat', category: 'handwriting', weights: [400, 500, 600, 700] },
  { id: 'dancing-script', name: 'Dancing Script', category: 'handwriting', weights: [400, 500, 600, 700] },
];

const DEFAULT_TYPOGRAPHY: TypographySettings = {
  fontFamily: 'inter',
  variants: {
    display: {
      fontFamily: 'inter',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: -0.02,
      fontSize: 72,
    },
    heading: {
      fontFamily: 'inter',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: -0.01,
      fontSize: 32,
    },
    body: {
      fontFamily: 'inter',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: 0,
      fontSize: 16,
    },
  },
};

interface TypographyStepProps {
  data: {
    typography?: TypographySettings;
  };
  onDataChange: (data: any) => void;
}

export function TypographyStep({ data, onDataChange }: TypographyStepProps) {
  const [activeVariant, setActiveVariant] = useState<FontVariant>('heading');
  const [typography, setTypography] = useState<TypographySettings>(
    data?.typography || DEFAULT_TYPOGRAPHY
  );
  const [fontPreviewText, setFontPreviewText] = useState('The quick brown fox jumps over the lazy dog');
  const [selectedFont, setSelectedFont] = useState<FontFamily>(
    FONT_FAMILIES.find(font => font.id === (data?.typography?.fontFamily || 'inter')) || FONT_FAMILIES[0]
  );

  // Update font preview when typography changes
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    
    // Get unique font families
    const fontFamilies = new Set<string>();
    Object.values(typography.variants).forEach(variant => {
      const font = FONT_FAMILIES.find(f => f.id === variant.fontFamily) || FONT_FAMILIES[0];
      fontFamilies.add(`${font.name.replace(/\s+/g, '+')}:wght@${font.weights.join(';')}`);
    });
    
    link.href = `https://fonts.googleapis.com/css2?${Array.from(fontFamilies).join('&')}&display=swap`;
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, [typography]);

  const updateTypography = (updates: Partial<TypographySettings>) => {
    const updated = { ...typography, ...updates };
    setTypography(updated);
    onDataChange({ ...data, typography: updated });
  };

  const updateVariant = (variant: FontVariant, updates: Partial<TypographySettings['variants'][FontVariant]>) => {
    const updated = {
      ...typography,
      variants: {
        ...typography.variants,
        [variant]: {
          ...typography.variants[variant],
          ...updates,
        },
      },
    };
    setTypography(updated);
    onDataChange({ ...data, typography: updated });
  };

  const handleFontChange = (fontId: string) => {
    const font = FONT_FAMILIES.find(f => f.id === fontId) || FONT_FAMILIES[0];
    setSelectedFont(font);
    
    // Update the active variant with the new font family
    updateVariant(activeVariant, { fontFamily: font.id });
    
    // Also update the default font family if this is the first font being selected
    if (typography.fontFamily === 'inter' && font.id !== 'inter') {
      updateTypography({ fontFamily: font.id });
    }
  };

  const getFontFamilyCSS = (fontId: string) => {
    const font = FONT_FAMILIES.find(f => f.id === fontId) || FONT_FAMILIES[0];
    return `"${font.name}", ${font.category === 'sans-serif' ? 'sans-serif' : font.category === 'serif' ? 'serif' : 'sans-serif'}`;
  };

  const renderPreviewText = () => {
    const variant = typography.variants[activeVariant];
    const font = FONT_FAMILIES.find(f => f.id === variant.fontFamily) || FONT_FAMILIES[0];
    
    return (
      <div 
        className="p-6 rounded-lg border min-h-[200px] flex items-center justify-center text-center"
        style={{
          fontFamily: getFontFamilyCSS(variant.fontFamily),
          fontWeight: variant.fontWeight,
          lineHeight: variant.lineHeight,
          letterSpacing: `${variant.letterSpacing}em`,
          fontSize: `${variant.fontSize}px`,
        }}
      >
        {fontPreviewText}
      </div>
    );
  };

  const renderControls = () => {
    const variant = typography.variants[activeVariant];
    const font = FONT_FAMILIES.find(f => f.id === variant.fontFamily) || FONT_FAMILIES[0];
    
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select
            value={font.id}
            onValueChange={handleFontChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Sans-serif</div>
                {FONT_FAMILIES.filter(f => f.category === 'sans-serif').map((font) => (
                  <SelectItem 
                    key={font.id} 
                    value={font.id}
                    className="font-sans"
                    style={{ fontFamily: `"${font.name}", sans-serif` }}
                  >
                    {font.name}
                  </SelectItem>
                ))}
                
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-2">Serif</div>
                {FONT_FAMILIES.filter(f => f.category === 'serif').map((font) => (
                  <SelectItem 
                    key={font.id} 
                    value={font.id}
                    className="font-serif"
                    style={{ fontFamily: `"${font.name}", serif` }}
                  >
                    {font.name}
                  </SelectItem>
                ))}
                
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-2">Display</div>
                {FONT_FAMILIES.filter(f => f.category === 'display').map((font) => (
                  <SelectItem 
                    key={font.id} 
                    value={font.id}
                    style={{ fontFamily: `"${font.name}", sans-serif` }}
                  >
                    {font.name}
                  </SelectItem>
                ))}
                
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-2">Handwriting</div>
                {FONT_FAMILIES.filter(f => f.category === 'handwriting').map((font) => (
                  <SelectItem 
                    key={font.id} 
                    value={font.id}
                    style={{ fontFamily: `"${font.name}", cursive` }}
                  >
                    {font.name}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Font Weight</Label>
            <span className="text-sm text-muted-foreground">{variant.fontWeight}</span>
          </div>
          <Slider
            min={100}
            max={900}
            step={100}
            value={[variant.fontWeight]}
            onValueChange={([value]) => updateVariant(activeVariant, { fontWeight: value })}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Light</span>
            <span>Regular</span>
            <span>Medium</span>
            <span>Bold</span>
            <span>Black</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Font Size</Label>
            <span className="text-sm text-muted-foreground">{variant.fontSize}px</span>
          </div>
          <Slider
            min={8}
            max={144}
            step={1}
            value={[variant.fontSize]}
            onValueChange={([value]) => updateVariant(activeVariant, { fontSize: value })}
            className="py-4"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Line Height</Label>
            <span className="text-sm text-muted-foreground">{variant.lineHeight.toFixed(1)}</span>
          </div>
          <Slider
            min={0.8}
            max={3}
            step={0.1}
            value={[variant.lineHeight]}
            onValueChange={([value]) => updateVariant(activeVariant, { lineHeight: value })}
            className="py-4"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Letter Spacing</Label>
            <span className="text-sm text-muted-foreground">
              {variant.letterSpacing > 0 ? '+' : ''}
              {(variant.letterSpacing * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            min={-0.1}
            max={0.2}
            step={0.01}
            value={[variant.letterSpacing]}
            onValueChange={([value]) => updateVariant(activeVariant, { letterSpacing: value })}
            className="py-4"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Preview Text</Label>
          <input
            type="text"
            value={fontPreviewText}
            onChange={(e) => setFontPreviewText(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                <span>Typography Scale</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Define typography styles for different text elements
              </p>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={activeVariant} 
                onValueChange={(value) => setActiveVariant(value as FontVariant)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="display" className="flex items-center gap-2">
                    <Heading1 className="h-4 w-4" />
                    <span>Display</span>
                  </TabsTrigger>
                  <TabsTrigger value="heading" className="flex items-center gap-2">
                    <Heading2 className="h-4 w-4" />
                    <span>Heading</span>
                  </TabsTrigger>
                  <TabsTrigger value="body" className="flex items-center gap-2">
                    <Text className="h-4 w-4" />
                    <span>Body</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="mt-6">
                  {renderPreviewText()}
                  <div className="mt-6">
                    {renderControls()}
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Type Scale Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                See how your typography looks in different contexts
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 
                  className="text-4xl font-bold mb-4"
                  style={{
                    fontFamily: getFontFamilyCSS(typography.variants.display.fontFamily),
                    fontWeight: typography.variants.display.fontWeight,
                    lineHeight: typography.variants.display.lineHeight,
                    letterSpacing: `${typography.variants.display.letterSpacing}em`,
                  }}
                >
                  Display Heading
                </h3>
                <p 
                  className="text-muted-foreground"
                  style={{
                    fontFamily: getFontFamilyCSS(typography.variants.body.fontFamily),
                    fontSize: '1rem',
                    lineHeight: typography.variants.body.lineHeight,
                  }}
                >
                  This is a display heading, perfect for page titles and hero sections.
                </p>
              </div>
              
              <div>
                <h4 
                  className="text-2xl font-semibold mb-3"
                  style={{
                    fontFamily: getFontFamilyCSS(typography.variants.heading.fontFamily),
                    fontWeight: typography.variants.heading.fontWeight,
                    lineHeight: typography.variants.heading.lineHeight,
                    letterSpacing: `${typography.variants.heading.letterSpacing}em`,
                  }}
                >
                  Section Heading
                </h4>
                <p 
                  className="mb-4"
                  style={{
                    fontFamily: getFontFamilyCSS(typography.variants.body.fontFamily),
                    fontSize: '1rem',
                    lineHeight: typography.variants.body.lineHeight,
                  }}
                >
                  This is a section heading. It helps organize content into digestible sections. 
                  The quick brown fox jumps over the lazy dog. 1234567890
                </p>
                <p 
                  className="text-sm text-muted-foreground"
                  style={{
                    fontFamily: getFontFamilyCSS(typography.variants.body.fontFamily),
                    lineHeight: typography.variants.body.lineHeight,
                  }}
                >
                  This is a smaller paragraph for supporting text, captions, or secondary information.
                </p>
              </div>
              
              <div className="flex gap-4 pt-4 border-t">
                <Button variant="default" size="sm">
                  Primary Action
                </Button>
                <Button variant="outline" size="sm">
                  Secondary
                </Button>
                <Button variant="ghost" size="sm">
                  Ghost
                </Button>
                <Button variant="link" size="sm" className="text-primary">
                  Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Font Pairing</CardTitle>
              <p className="text-sm text-muted-foreground">
                Suggested font combinations that work well together
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { 
                  name: 'Modern & Clean', 
                  heading: 'Inter', 
                  body: 'Inter',
                  category: 'Sans-serif' 
                },
                { 
                  name: 'Classic & Elegant', 
                  heading: 'Playfair Display', 
                  body: 'Lora',
                  category: 'Serif' 
                },
                { 
                  name: 'Bold & Impactful', 
                  heading: 'Bebas Neue', 
                  body: 'Inter',
                  category: 'Display + Sans' 
                },
                { 
                  name: 'Friendly & Approachable', 
                  heading: 'Plus Jakarta Sans', 
                  body: 'Crimson Pro',
                  category: 'Sans + Serif' 
                },
                { 
                  name: 'Playful & Creative', 
                  heading: 'Caveat', 
                  body: 'Figtree',
                  category: 'Handwriting + Sans' 
                },
              ].map((pairing, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 rounded-lg border hover:border-primary transition-colors"
                  onClick={() => {
                    const headingFont = FONT_FAMILIES.find(f => f.name.toLowerCase() === pairing.heading.toLowerCase()) || FONT_FAMILIES[0];
                    const bodyFont = FONT_FAMILIES.find(f => f.name.toLowerCase() === pairing.body.toLowerCase()) || FONT_FAMILIES[0];
                    
                    updateTypography({
                      fontFamily: headingFont.id,
                      variants: {
                        ...typography.variants,
                        display: {
                          ...typography.variants.display,
                          fontFamily: headingFont.id,
                        },
                        heading: {
                          ...typography.variants.heading,
                          fontFamily: headingFont.id,
                        },
                        body: {
                          ...typography.variants.body,
                          fontFamily: bodyFont.id,
                        },
                      },
                    });
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{pairing.name}</div>
                      <div className="text-xs text-muted-foreground">{pairing.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium" style={{ fontFamily: `"${pairing.heading}"` }}>
                        {pairing.heading}
                      </div>
                      <div className="text-xs text-muted-foreground" style={{ fontFamily: `"${pairing.body}"` }}>
                        {pairing.body}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Typography Scale</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your complete typography system
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Display</span>
                  <span className="text-xs text-muted-foreground">
                    {typography.variants.display.fontSize}px • {typography.variants.display.fontWeight} • 
                    {(typography.variants.display.letterSpacing * 100).toFixed(0)}%
                  </span>
                </div>
                <div 
                  className="text-4xl font-bold"
                  style={{
                    fontFamily: getFontFamilyCSS(typography.variants.display.fontFamily),
                    fontWeight: typography.variants.display.fontWeight,
                    lineHeight: typography.variants.display.lineHeight,
                    letterSpacing: `${typography.variants.display.letterSpacing}em`,
                  }}
                >
                  Display
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Heading</span>
                  <span className="text-xs text-muted-foreground">
                    {typography.variants.heading.fontSize}px • {typography.variants.heading.fontWeight} • 
                    {(typography.variants.heading.letterSpacing * 100).toFixed(0)}%
                  </span>
                </div>
                <div 
                  className="text-2xl font-semibold"
                  style={{
                    fontFamily: getFontFamilyCSS(typography.variants.heading.fontFamily),
                    fontWeight: typography.variants.heading.fontWeight,
                    lineHeight: typography.variants.heading.lineHeight,
                    letterSpacing: `${typography.variants.heading.letterSpacing}em`,
                  }}
                >
                  Heading
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Body</span>
                  <span className="text-xs text-muted-foreground">
                    {typography.variants.body.fontSize}px • {typography.variants.body.fontWeight} • 
                    {(typography.variants.body.letterSpacing * 100).toFixed(0)}%
                  </span>
                </div>
                <div 
                  className="text-base"
                  style={{
                    fontFamily: getFontFamilyCSS(typography.variants.body.fontFamily),
                    fontWeight: typography.variants.body.fontWeight,
                    lineHeight: typography.variants.body.lineHeight,
                    letterSpacing: `${typography.variants.body.letterSpacing}em`,
                  }}
                >
                  The quick brown fox jumps over the lazy dog. 1234567890
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
