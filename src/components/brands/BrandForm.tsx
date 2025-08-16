import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { brandFormSchema, type BrandFormValues } from '@/schemas/brand.schema';
import { BrandFormStep1 } from './BrandFormSteps/Step1';
import { BrandFormStep2 } from './BrandFormSteps/Step2';
import { BrandFormStep3 } from './BrandFormSteps/Step3';
import { BrandFormStep4 } from './BrandFormSteps/Step4';
import { BrandFormStep5 } from './BrandFormSteps/Step5';

const TOTAL_STEPS = 5;

export function BrandForm({ initialData, onSuccess }: { 
  initialData?: Partial<BrandFormValues>,
  onSuccess?: () => void 
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const methods = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      brand_name: '',
      tagline: '',
      online_link: '',
      elevator_pitch: '',
      industry: '',
      offerings: '',
      usp: '',
      problem_solved: '',
      primary_audience: '',
      age_range: '',
      gender_focus: '',
      income_level: '',
      brand_personality: {
        masculine: 5,
        classic: 5,
        playful: 5,
        loud: 5,
        approachable: 5,
        warm: 5,
        traditional: 5,
        luxury: 5,
        textFocused: 5,
        corporate: 5,
      },
      one_year_vision: '',
      five_year_vision: '',
      challenges: '',
      competitors: '',
      likes_dislikes: '',
      launch_timing: '',
      budget_range: '',
      extra_notes: '',
      ...initialData,
    },
  });

  const { handleSubmit, trigger, formState: { errors } } = methods;

  const nextStep = async () => {
    // Validate current step before proceeding
    let fields: (keyof BrandFormValues)[] = [];
    
    switch (step) {
      case 1:
        fields = ['brand_name', 'tagline', 'online_link', 'elevator_pitch', 'industry'];
        break;
      case 2:
        fields = ['offerings', 'usp', 'problem_solved'];
        break;
      case 3:
        fields = ['primary_audience', 'age_range', 'gender_focus', 'income_level'];
        break;
      case 4:
        fields = ['brand_personality'];
        break;
      default:
        break;
    }

    const isValid = await trigger(fields);
    if (isValid) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data: BrandFormValues) => {
    if (!user) {
      // Save to session storage if user is not logged in
      sessionStorage.setItem('pendingBrandData', JSON.stringify(data));
      navigate('/auth', { state: { fromOnboarding: true } });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Check if this is an update or create
      if (initialData && 'id' in initialData && initialData.id) {
        // Update existing brand
        const { error } = await supabase
          .from('onboarding_responses')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id);
          
        if (error) throw error;
        
        toast({
          title: 'Success!',
          description: 'Your brand has been updated.',
        });
      } else {
        // Create new brand
        const { data: brand, error } = await supabase
          .from('onboarding_responses')
          .insert([
            {
              ...data,
              user_id: user.id,
            },
          ])
          .select()
          .single();
          
        if (error) throw error;
        
        toast({
          title: 'Success!',
          description: 'Your brand has been created.',
        });
        
        // Redirect to brand details page
        if (brand) {
          navigate(`/brand-details`);
        }
      }
      
      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving brand:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save brand. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BrandFormStep1 />;
      case 2:
        return <BrandFormStep2 />;
      case 3:
        return <BrandFormStep3 />;
      case 4:
        return <BrandFormStep4 />;
      case 5:
        return <BrandFormStep5 />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {step === 1 && 'Brand Basics'}
            {step === 2 && 'Business Details'}
            {step === 3 && 'Target Audience'}
            {step === 4 && 'Brand Personality'}
            {step === 5 && 'Vision & Strategy'}
          </h2>
          <div className="text-sm text-muted-foreground">
            Step {step} of {TOTAL_STEPS}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2.5 mb-8">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        {/* Form content */}
        <Card>
          <CardContent className="pt-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {step < TOTAL_STEPS ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {(initialData && 'id' in initialData && initialData.id) ? 'Update Brand' : 'Create Brand'}
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
