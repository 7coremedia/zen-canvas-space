import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessStepProps {
  onBack: () => void;
  onComplete: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ onBack, onComplete }) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight mb-2">All Set!</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Your brand details have been saved successfully. Let's create something amazing!
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button 
          size="lg" 
          className="px-8 py-6 text-lg"
          onClick={onComplete}
        >
          Generate My Brand
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="px-8 py-6 text-lg"
          onClick={onBack}
        >
          Back to Edit
        </Button>
      </div>
    </div>
  );
};

export default SuccessStep;
