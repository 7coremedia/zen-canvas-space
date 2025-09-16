import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"; // Added FormDescription
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowLeft, ArrowRight, PartyPopper } from "lucide-react";

// --- FORM SCHEMA AND TYPES ---
import { 
  archetypes, 
  logoStyles, 
  colorPalettes, 
  typographyPairings, 
  imageryStyles, 
  geographicFocusOptions, 
  distributionChannels, 
  businessModels, 
  platforms, 
  marketingGoals 
} from "@/config/brandOptions";

const industries = ["Technology", "E-commerce", "Health & Wellness", "Finance", "Education", "Hospitality", "Real Estate", "Fashion", "Food & Beverage", "Agency/Consulting", "Other"] as const;

const FormSchema = z.object({
  // Step 1: Basic Brand Info
  brandName: z.string().min(2, "Please enter a name with at least 2 characters."),
  tagline: z.string().optional(),
  corePromise: z.string().min(10, "Your core promise needs to be at least 10 characters."),
  archetype: z.enum(archetypes, { required_error: "Please select a brand archetype." }),
  
  // Step 2: Identity & Personality
  personalityMasculineFeminine: z.number().min(0).max(100).default(50),
  personalityPlayfulSerious: z.number().min(0).max(100).default(50),
  personalityLuxuryAffordable: z.number().min(0).max(100).default(50),
  personalityClassicModern: z.number().min(0).max(100).default(50),
  personalityBoldSubtle: z.number().min(0).max(100).default(50),
  personalityLocalGlobal: z.number().min(0).max(100).default(50),
  
  // Step 3: Visual Direction
  logoStyle: z.string().min(1, "Please select a logo style."),
  colorPalette: z.string().min(1, "Please select a color palette."),
  typographyFeel: z.string().min(1, "Please select a typography pairing."),
  imageryStyle: z.string().min(1, "Please select an imagery style."),
  moodboardUpload: z.any().optional(),
  
  // Step 4: Audience & Market
  audienceAgeRangeMin: z.number().min(0).max(100).default(18),
  audienceAgeRangeMax: z.number().min(0).max(100).default(65),
  audienceGender: z.number().min(0).max(100).default(50), // 0 = Male, 100 = Female
  audienceIncome: z.number().min(0).max(100).default(50), // 0 = Low, 100 = High
  geographicFocus: z.enum(geographicFocusOptions, { required_error: "Please select a geographic focus." }),
  audiencePainPoints: z.string().min(10, "Please describe your audience's pain points (min. 10 characters)."),
  competitors: z.array(z.string()).min(1, "Please add at least one competitor."),
  
  // Step 5: Positioning & Business
  industry: z.enum(industries, { required_error: "Please select your industry." }),
  usp: z.string().min(10, "Your unique selling proposition needs to be at least 10 characters."),
  differentiation: z.array(z.string()).min(1, "Please add at least one differentiation factor."),
  coreValues: z.array(z.string()).min(1, "Please add at least one core value."),
  visionMission: z.string().min(10, "Your vision/mission needs to be at least 10 characters."),
  
  // Step 6: Products & Services
  offerings: z.array(z.string()).min(1, "Please add at least one product or service."),
  pricePositioning: z.number().min(0).max(100).default(50), // 0 = Budget, 100 = Premium
  distributionChannels: z.array(z.enum(distributionChannels)).min(1, "Please select at least one distribution channel."),
  businessModel: z.enum(businessModels, { required_error: "Please select a business model." }),
  
  // Step 7: Marketing & Communication
  toneOfVoiceFriendlyFormal: z.number().min(0).max(100).default(50),
  toneOfVoiceInspirationalPractical: z.number().min(0).max(100).default(50),
  preferredPlatforms: z.array(z.enum(platforms)).min(1, "Please select at least one platform."),
  marketingGoals: z.array(z.enum(marketingGoals)).min(1, "Please select at least one marketing goal."),
  brandStory: z.string().min(10, "Your brand story needs to be at least 10 characters."),
  
  // Step 8: Technical & Legal
  domain: z.string().optional(),
  socialHandles: z.array(z.string()).optional(),
  trademarkStatus: z.boolean().default(false),
  registrationDocsUpload: z.any().optional(),
  
  // Notes Panel (persistent across steps)
  notes: z.string().optional(),
  
  // Contact Info (for submission)
  senderName: z.string().min(2, "Please enter your name."),
  senderEmail: z.string().email("Please enter a valid email address."),
});

type FormValues = z.infer<typeof FormSchema>;

// TEMP: Align validation with currently implemented UI steps
const formSteps = [
  { id: 1, name: "Basic Brand Info", fields: ["brandName", "senderName", "senderEmail"] },
  { id: 2, name: "Business Basics", fields: ["industry"] },
  { id: 3, name: "Visual Direction", fields: ["logoStyle", "colorPalette", "typographyFeel", "imageryStyle"] },
  { id: 4, name: "Final", fields: [] },
];
const totalSteps = formSteps.length;

// --- STEP COMPONENTS ---

const Step1 = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <FormField control={control} name="brandName" render={({ field }) => (
        <FormItem>
          <FormLabel>What’s your brand or business name?</FormLabel>
          <FormControl><Input placeholder="e.g., KING, Inc." {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="corePromise" render={({ field }) => (
        <FormItem>
          <FormLabel>Describe your business in one sentence.</FormLabel>
          <FormControl><Textarea placeholder="We help X do Y so they can achieve Z." {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <div className="pt-4">
        <h3 className="text-lg font-semibold mb-3">Your Contact Information</h3>
        <FormField control={control} name="senderName" render={({ field }) => (
          <FormItem>
            <FormLabel>Your Full Name *</FormLabel>
            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name="senderEmail" render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Your Email Address *</FormLabel>
            <FormDescription>We will use this email to communicate about your onboarding.</FormDescription>
            <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
    </motion.div>
  );
};

const Step2 = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <FormField control={control} name="industry" render={({ field }) => (
        <FormItem>
          <FormLabel>What industry are you in?</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl><SelectTrigger><SelectValue placeholder="Select an industry" /></SelectTrigger></FormControl>
            <SelectContent>
              {industries.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />
      
    </motion.div>
  );
};

// Visual selector card component
const VisualSelectorCard = ({ 
  id, 
  label, 
  description, 
  preview, 
  selected, 
  onSelect 
}: { 
  id: string; 
  label: string; 
  description?: string; 
  preview: string; 
  selected: boolean; 
  onSelect: () => void; 
}) => {
  return (
    <div 
      className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-primary ${
        selected ? "border-primary bg-primary/5" : "border-border"
      }`}
      onClick={onSelect}
    >
      <div className="aspect-video w-full overflow-hidden rounded-md bg-muted mb-3">
        <img 
          src={preview} 
          alt={label} 
          className="h-full w-full object-cover" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>
      <h4 className="font-medium">{label}</h4>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {selected && (
        <div className="absolute right-2 top-2 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      )}
    </div>
  );
};

// Color palette preview component
const ColorPalettePreview = ({ colors }: { colors: string[] }) => {
  return (
    <div className="flex space-x-1 mt-2">
      {colors.map((color, index) => (
        <div 
          key={index} 
          className="h-4 w-8 rounded-sm" 
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

const Step3 = () => {
  const { control, watch } = useFormContext<FormValues>();
  const logoStyleValue = watch("logoStyle");
  const colorPaletteValue = watch("colorPalette");
  const typographyFeelValue = watch("typographyFeel");
  const imageryStyleValue = watch("imageryStyle");

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <div>
        <h3 className="text-lg font-semibold mb-4">Logo Style</h3>
        <FormField
          control={control}
          name="logoStyle"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {logoStyles.map((style) => (
                  <VisualSelectorCard
                    key={style.id}
                    id={style.id}
                    label={style.label}
                    description={style.description}
                    preview={style.preview}
                    selected={field.value === style.id}
                    onSelect={() => field.onChange(style.id)}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
        <FormField
          control={control}
          name="colorPalette"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {colorPalettes.map((palette) => (
                  <div 
                    key={palette.id}
                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-primary ${
                      field.value === palette.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => field.onChange(palette.id)}
                  >
                    <div className="aspect-video w-full overflow-hidden rounded-md bg-muted mb-3">
                      <img 
                        src={palette.preview} 
                        alt={palette.label} 
                        className="h-full w-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <h4 className="font-medium">{palette.label}</h4>
                    <ColorPalettePreview colors={palette.colors} />
                    {field.value === palette.id && (
                      <div className="absolute right-2 top-2 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Typography</h3>
        <FormField
          control={control}
          name="typographyFeel"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {typographyPairings.map((pairing) => (
                  <div 
                    key={pairing.id}
                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-primary ${
                      field.value === pairing.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => field.onChange(pairing.id)}
                  >
                    <div className="aspect-video w-full overflow-hidden rounded-md bg-muted mb-3">
                      <img 
                        src={pairing.preview} 
                        alt={pairing.label} 
                        className="h-full w-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <h4 className="font-medium">{pairing.label}</h4>
                    <p className="text-sm text-muted-foreground">
                      Headline: {pairing.headlineFont} / Body: {pairing.bodyFont}
                    </p>
                    {field.value === pairing.id && (
                      <div className="absolute right-2 top-2 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Imagery Style</h3>
        <FormField
          control={control}
          name="imageryStyle"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {imageryStyles.map((style) => (
                  <VisualSelectorCard
                    key={style.id}
                    id={style.id}
                    label={style.label}
                    description={style.description}
                    preview={style.preview}
                    selected={field.value === style.id}
                    onSelect={() => field.onChange(style.id)}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Moodboard (Optional)</h3>
        <FormField
          control={control}
          name="moodboardUpload"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                  }} 
                />
              </FormControl>
              <FormDescription>
                Upload an image that represents the mood or feeling you want for your brand.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
};

// Step4 was referencing undefined options; temporarily removed until implemented

const FinalStep = () => (
  <motion.div className="text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
    <PartyPopper className="mx-auto h-16 w-16 text-green-500" />
    <h2 className="mt-4 text-2xl font-bold">You're All Set!</h2>
    <p className="mt-2 text-muted-foreground">
      You've laid the foundation. Click 'Submit Onboarding' to send your brand details.
    </p>
  </motion.div>
);


// --- MAIN FORM COMPONENT ---

export default function OnboardingForm() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = React.useState(() => {
    try {
      const savedStep = sessionStorage.getItem('onboardingFormStep');
      return savedStep ? parseInt(savedStep, 10) : 1;
    } catch {
      return 1;
    }
  });
  const [loading, setLoading] = React.useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = React.useState(true);
  
  // Load saved form data from session storage on initial render
  const loadSavedFormData = () => {
    try {
      const savedData = sessionStorage.getItem('onboardingFormData');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
    return null;
  };

  const methods = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: loadSavedFormData() || {
      brandName: "",
      corePromise: "",
      tagline: "",
      senderName: "", 
      senderEmail: "",
      industry: undefined,
      logoStyle: undefined,
      colorPalette: undefined,
      typographyFeel: undefined,
      imageryStyle: undefined,
    },
  });
  
  // Auto-save form data when values change
  React.useEffect(() => {
    if (!autoSaveEnabled) return;
    
    const subscription = methods.watch((formValues) => {
      // Debounce the save to avoid excessive writes
      const timeoutId = setTimeout(() => {
        try {
          sessionStorage.setItem('onboardingFormData', JSON.stringify(formValues));
          sessionStorage.setItem('onboardingFormStep', step.toString());
        } catch (error) {
          console.error('Error saving form data:', error);
        }
      }, 1000);
    });
    
    return () => subscription.unsubscribe();
  }, [methods, step, autoSaveEnabled]);

  const nextStep = async () => {
    const fields = formSteps.find(s => s.id === step)?.fields;
    if (!fields || fields.length === 0) {
      setStep(prev => Math.min(prev + 1, totalSteps + 1));
      return;
    }
    const isValid = await methods.trigger(fields as (keyof FormValues)[]);
    if (isValid) {
      setStep(prev => Math.min(prev + 1, totalSteps + 1));
    }
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const onSubmit = async (values: FormValues) => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }
    
    // Prepare onboarding data
    const onboardingData: any = {
      brand_name: values.brandName,
      elevator_pitch: values.corePromise,
      sender_name: values.senderName,
      sender_email: values.senderEmail,
      industry: values.industry,
      offerings: values.offerings,
      primary_audience: null,
      one_year_vision: null,
      budget: null,
      launch_timeline: null,
      // Add visual direction fields
      logo_style: values.logoStyle,
      color_palette: values.colorPalette,
      typography: values.typographyFeel,
      imagery_style: values.imageryStyle,
      // Add session ID for non-authenticated users
      session_id: !user ? crypto.randomUUID() : null,
    };
    
    // Check if user is authenticated
    if (!user) {
      // Save onboarding data to session storage
      sessionStorage.setItem('pendingOnboardingData', JSON.stringify(onboardingData));
      
      // Redirect to auth page
      navigate('/auth', { 
        state: { 
          fromOnboarding: true,
          message: "Please sign up or sign in to complete your onboarding." 
        } 
      });
      return;
    }

    // User is authenticated, proceed with submission
    setLoading(true);
    try {
      // Add user_id to data when authenticated
      (onboardingData as any).user_id = user.id;
      
      // Save to Supabase
      const { data, error } = await supabase
        .from<any>('onboarding_responses')
        .insert(onboardingData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Also send email notification if configured
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID!,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
          onboardingData,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
        );
      } catch (emailError) {
        console.error('EmailJS notification error:', emailError);
        // Continue even if email fails
      }

      toast({ 
        title: "Onboarding Submitted!", 
        description: "Your brand details have been successfully saved." 
      });
      
      // Redirect to dashboard or brand details page
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Supabase submission error:', error);
      toast({ 
        title: "Submission Failed", 
        description: error.message || "Could not save your brand details. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / (totalSteps + 1)) * 100;

  return (
    <div className="mx-auto max-w-2xl rounded-xl border bg-card p-8 shadow-lg">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="mb-8 space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Step {step} of {totalSteps + 1}
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="autosave" 
                  checked={autoSaveEnabled} 
                  onCheckedChange={(checked) => setAutoSaveEnabled(!!checked)} 
                />
                <label htmlFor="autosave" className="text-sm text-muted-foreground cursor-pointer">
                  Autosave
                </label>
              </div>
            </div>
          </div>

          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              {step === 1 && <Step1 key="step1" />}
              {step === 2 && <Step2 key="step2" />}
              {step === 3 && <Step3 key="step3" />}
              {step === 4 && <FinalStep key="final-step" />}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-between">
            {step > 1 && step <= totalSteps && (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            <div className="flex-grow" />
            {step <= totalSteps && (
              <Button type="button" variant="premium" onClick={nextStep}>
                {step === totalSteps ? "Finish" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {step === totalSteps + 1 && (
              <Button type="submit" variant="premium" disabled={loading || authLoading} className="w-full">
                {loading || authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit Onboarding'}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
