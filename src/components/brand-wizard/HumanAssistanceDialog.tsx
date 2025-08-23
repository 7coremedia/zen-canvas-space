import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, MessageCircleQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface HumanAssistanceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentStep: number;
  brandData: any;
  brandId?: string;
  onSaveBrand: () => Promise<string>;
}

export function HumanAssistanceDialog({ 
  isOpen, 
  onOpenChange, 
  currentStep,
  brandData,
  brandId,
  onSaveBrand
}: HumanAssistanceDialogProps) {
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message for our team.',
        variant: 'destructive',
      });
      return;
    }

    if (!contactEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide your email address so we can contact you.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Save the brand first to ensure we have an ID
      const savedBrandId = await onSaveBrand();
      
      // In a real app, this would be an API call to your backend
      console.log('Submitting human assistance request:', {
        brandId: savedBrandId,
        currentStep,
        message,
        contactEmail,
        contactName: contactName.trim() || undefined,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Request submitted!',
        description: 'Our team will review your request and get back to you soon.',
      });
      
      // Navigate to the read-only view
      navigate(`/brands/${savedBrandId}/assistance`);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error submitting assistance request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <MessageCircleQuestion className="h-6 w-6 text-primary" />
            <DialogTitle>Get Human Assistance</DialogTitle>
          </div>
          <DialogDescription>
            Our design team will help you perfect your brand. Please provide some details about what you need help with.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">How can we help you? *</Label>
            <Textarea
              id="message"
              placeholder="Tell us what you need help with..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Please be as specific as possible about what you'd like help with.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Your Name (Optional)</Label>
              <Input
                id="contactName"
                placeholder="John Doe"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Your Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="you@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          
          <div className="rounded-md bg-muted/50 p-4">
            <h4 className="text-sm font-medium mb-2">Request Details</h4>
            <div className="text-sm space-y-1">
              <p className="flex justify-between">
                <span className="text-muted-foreground">Current Step:</span>
                <span className="font-medium">
                  {currentStep === 0 ? 'Brand Name' : 
                   currentStep === 1 ? 'Logo' : 
                   currentStep === 2 ? 'Colors' : 
                   currentStep === 3 ? 'Typography' : 'Additional Details'}
                </span>
              </p>
              {brandId && (
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Brand ID:</span>
                  <span className="font-mono text-xs">{brandId}</span>
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Hook to use the dialog
export function useHumanAssistance() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [brandData, setBrandData] = useState<any>(null);
  const [brandId, setBrandId] = useState<string | undefined>(undefined);
  const [onSaveBrand, setOnSaveBrand] = useState<() => Promise<string>>(
    () => Promise.resolve('')
  );

  const openDialog = (params: {
    currentStep: number;
    brandData: any;
    brandId?: string;
    onSaveBrand: () => Promise<string>;
  }) => {
    setCurrentStep(params.currentStep);
    setBrandData(params.brandData);
    setBrandId(params.brandId);
    setOnSaveBrand(() => params.onSaveBrand);
    setIsOpen(true);
  };

  const dialog = (
    <HumanAssistanceDialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      currentStep={currentStep}
      brandData={brandData}
      brandId={brandId}
      onSaveBrand={onSaveBrand}
    />
  );

  return {
    dialog,
    openHumanAssistance: openDialog,
  };
}
