import React from 'react';
import { useWizard } from '@/hooks/useWizard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BusinessIdeaStep = () => {
  const { wizardState, updateField } = useWizard();

  return (
    <div className="space-y-8">
      <div>
        <Label htmlFor="business-idea" className="text-lg font-semibold">
          Your Business Idea
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          What do you want to build or sell?
        </p>
        <Input
          id="business-idea"
          value={wizardState.idea}
          onChange={(e) => updateField('idea', e.target.value)}
          placeholder="e.g., An AI-powered platform for personal finance"
          className="py-6 text-base"
        />
      </div>

      <div>
        <Label htmlFor="industry" className="text-lg font-semibold">
          Industry
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          What industry does your business belong to?
        </p>
        <Input
          id="industry"
          value={wizardState.industry}
          onChange={(e) => updateField('industry', e.target.value)}
          placeholder="e.g., Technology, Fashion, Food & Beverage"
          className="py-6 text-base"
        />
      </div>
    </div>
  );
};

export default BusinessIdeaStep;
