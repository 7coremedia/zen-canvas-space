import React from 'react';
import { useWizard } from '@/hooks/useWizard';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const BrandVoiceStep = () => {
  const { wizardState, updateField } = useWizard();

  return (
    <div className="space-y-8">
      <div>
        <Label htmlFor="brand-voice" className="text-lg font-semibold">
          Brand Voice
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          How would you describe your brand's personality?
        </p>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Casual</span>
              <span className="text-sm">Formal</span>
            </div>
            <Slider
              id="brand-voice"
              value={[wizardState.formality || 50]}
              onValueChange={(value) => updateField('formality', value[0])}
              min={0}
              max={100}
              step={1}
              className="py-4"
            />
          </div>
          
          <div>
            <Label htmlFor="tone" className="text-sm font-medium">
              Tone Keywords
            </Label>
            <Textarea
              id="tone"
              value={wizardState.toneKeywords}
              onChange={(e) => updateField('toneKeywords', e.target.value)}
              placeholder="e.g., Friendly, Professional, Authoritative"
              className="mt-1 min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="brand-message" className="text-sm font-medium">
              Key Brand Message
            </Label>
            <Textarea
              id="brand-message"
              value={wizardState.brandMessage}
              onChange={(e) => updateField('brandMessage', e.target.value)}
              placeholder="What's the main message you want to communicate?"
              className="mt-1 min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandVoiceStep;
