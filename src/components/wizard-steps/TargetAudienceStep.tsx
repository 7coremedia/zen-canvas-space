import React from 'react';
import { useWizard } from '@/hooks/useWizard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TargetAudienceStep = () => {
  const { wizardState, updateField } = useWizard();

  return (
    <div className="space-y-8">
      <div>
        <Label htmlFor="target-audience" className="text-lg font-semibold">
          Target Audience
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Who is your ideal customer?
        </p>
        <Input
          id="target-audience"
          value={wizardState.targetAudience}
          onChange={(e) => updateField('targetAudience', e.target.value)}
          placeholder="e.g., Young professionals aged 25-40 interested in tech"
          className="py-6 text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="age-range" className="text-sm font-medium">
            Age Range
          </Label>
          <Input
            id="age-range"
            value={wizardState.ageRange}
            onChange={(e) => updateField('ageRange', e.target.value)}
            placeholder="e.g., 25-40"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="location" className="text-sm font-medium">
            Location
          </Label>
          <Input
            id="location"
            value={wizardState.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="e.g., United States"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default TargetAudienceStep;
