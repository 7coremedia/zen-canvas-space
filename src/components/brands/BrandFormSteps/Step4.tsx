import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const personalityTraits = [
  {
    name: 'masculine',
    label: 'Masculine ↔ Feminine',
    left: 'Masculine',
    right: 'Feminine',
  },
  {
    name: 'classic',
    label: 'Classic ↔ Modern',
    left: 'Classic',
    right: 'Modern',
  },
  {
    name: 'playful',
    label: 'Playful ↔ Serious',
    left: 'Playful',
    right: 'Serious',
  },
  {
    name: 'loud',
    label: 'Loud ↔ Minimal',
    left: 'Loud',
    right: 'Minimal',
  },
  {
    name: 'approachable',
    label: 'Approachable ↔ Exclusive',
    left: 'Approachable',
    right: 'Exclusive',
  },
  {
    name: 'warm',
    label: 'Warm ↔ Cool',
    left: 'Warm',
    right: 'Cool',
  },
  {
    name: 'traditional',
    label: 'Traditional ↔ Innovative',
    left: 'Traditional',
    right: 'Innovative',
  },
  {
    name: 'luxury',
    label: 'Luxury ↔ Budget',
    left: 'Luxury',
    right: 'Budget',
  },
  {
    name: 'textFocused',
    label: 'Text-Focused ↔ Image-Focused',
    left: 'Text',
    right: 'Image',
  },
  {
    name: 'corporate',
    label: 'Corporate ↔ Artistic',
    left: 'Corporate',
    right: 'Artistic',
  },
];

export function BrandFormStep4() {
  const { control, watch } = useFormContext();
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Brand Personality</h3>
        <p className="text-sm text-muted-foreground">
          Rate your brand on each of these scales. This will help us understand your brand's personality.
        </p>
      </div>
      
      <div className="space-y-8">
        {personalityTraits.map((trait) => (
          <FormField
            key={trait.name}
            control={control}
            name={`brand_personality.${trait.name}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{trait.label}</FormLabel>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-24">{trait.left}</span>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <span className="text-sm text-muted-foreground w-24 text-right">{trait.right}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">1</span>
                  <span className="text-xs text-muted-foreground">10</span>
                </div>
                <div className="mt-1">
                  <div 
                    className={cn(
                      "h-2 rounded-full bg-primary/10",
                      "relative overflow-hidden"
                    )}
                  >
                    <div 
                      className="h-full bg-primary rounded-full absolute left-0 top-0"
                      style={{ width: `${(field.value / 10) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-center mt-1">
                    Selected: {field.value}/10
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
