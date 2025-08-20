import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"; // Added FormDescription
import { toast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, ArrowRight, PartyPopper } from "lucide-react";

// --- FORM SCHEMA AND TYPES ---
const industries = ["Technology", "E-commerce", "Health & Wellness", "Finance", "Education", "Hospitality", "Real Estate", "Fashion", "Food & Beverage", "Agency/Consulting", "Other"] as const;
const audienceOptions = ["Consumers (B2C)", "Businesses (B2B)", "Investors", "Non-profits", "Creators/Influencers", "Internal Team"] as const;
const budgetOptions = ["Less than $2,000", "$2,000 - $5,000", "$5,000 - $10,000", "$10,000 - $25,000", "$25,000+"] as const;
const launchTimelineOptions = ["ASAP", "1-3 months", "3-6 months", "6-12 months", "1+ year"] as const;

const FormSchema = z.object({
  // Step 1
  brandName: z.string().min(2, "Please enter a name with at least 2 characters."),
  elevator: z.string().min(10, "Your elevator pitch needs to be at least 10 characters."),
  senderName: z.string().min(2, "Please enter your name."), // New field
  senderEmail: z.string().email("Please enter a valid email address."), // New field

  // Step 2
  industry: z.enum(industries, { required_error: "Please select your industry." }),
  offerings: z.string().min(10, "Describe your offerings in at least 10 characters."),

  // Step 3
  audiencePrimary: z.array(z.enum(audienceOptions)).min(1, "Select at least one primary audience."),
  vision1y: z.string().min(10, "Share your 1-year vision (min. 10 characters)."),

  // Step 4
  budget: z.enum(budgetOptions, { required_error: "Please select your budget range." }),
  launchTimeline: z.enum(launchTimelineOptions, { required_error: "Please select your launch timeline." }),
});

type FormValues = z.infer<typeof FormSchema>;

const formSteps = [
  { id: 1, name: "Brand & Contact Basics", fields: ["brandName", "elevator", "senderName", "senderEmail"] }, // Updated fields for Step 1
  { id: 2, name: "Business DNA", fields: ["industry", "offerings"] },
  { id: 3, name: "Vision & Goals", fields: ["audiencePrimary", "vision1y"] },
  { id: 4, name: "Project Details", fields: ["budget", "launchTimeline"] },
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
      <FormField control={control} name="elevator" render={({ field }) => (
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
      <FormField control={control} name="offerings" render={({ field }) => (
        <FormItem>
          <FormLabel>What products or services do you offer?</FormLabel>
          <FormControl><Textarea placeholder="List your key products or services." {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </motion.div>
  );
};

const Step3 = () => {
  const { control, getValues } = useFormContext<FormValues>();
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <FormField control={control} name="audiencePrimary" render={() => (
        <FormItem>
          <FormLabel>Who is your primary audience?</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {audienceOptions.map((item) => (
              <FormField key={item} control={control} name="audiencePrimary" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(item)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, item])
                          : field.onChange(field.value?.filter((value) => value !== item));
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{item}</FormLabel>
                </FormItem>
              )} />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="vision1y" render={({ field }) => (
        <FormItem>
          <FormLabel>What is your vision for the next year?</FormLabel>
          <FormControl><Textarea placeholder="Describe your main goals and milestones." {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </motion.div>
  );
};

const Step4 = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <FormField
        control={control}
        name="budget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What's your budget range?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a budget range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {budgetOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="launchTimeline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>When do you plan to launch your brand?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a timeline" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {launchTimelineOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
};

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
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      brandName: "",
      elevator: "",
      senderName: "", // Default value for new field
      senderEmail: "", // Default value for new field
      industry: undefined,
      offerings: "",
      audiencePrimary: [],
      vision1y: "",
      budget: undefined,
      launchTimeline: undefined,
    },
  });

  const nextStep = async () => {
    const fields = formSteps.find(s => s.id === step)?.fields;
    const isValid = await methods.trigger(fields as (keyof FormValues)[]);
    if (isValid) {
      setStep(prev => Math.min(prev + 1, totalSteps + 1));
    }
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const templateParams = {
        brand_name: values.brandName,
        elevator_pitch: values.elevator,
        sender_name: values.senderName, // New template param
        sender_email: values.senderEmail, // New template param
        industry: values.industry,
        offerings: values.offerings,
        primary_audience: values.audiencePrimary.join(', '),
        one_year_vision: values.vision1y,
        budget: values.budget,
        launch_timeline: values.launchTimeline,
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );

      toast({ title: "Onboarding Submitted!", description: "Your brand details have been successfully sent." });
      navigate('/'); // Redirect to home or a thank you page
    } catch (error: any) {
      console.error('EmailJS submission error:', error);
      toast({ title: "Submission Failed", description: error.message || "Could not send your brand details. Please try again.", variant: "destructive" });
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
            <p className="text-center text-sm text-muted-foreground">
              Step {step} of {totalSteps + 1}
            </p>
          </div>

          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              {step === 1 && <Step1 key="step1" />}
              {step === 2 && <Step2 key="step2" />}
              {step === 3 && <Step3 key="step3" />}
              {step === 4 && <Step4 key="step4" />}
              {step === 5 && <FinalStep key="final-step" />}
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
              <Button type="submit" variant="premium" disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit Onboarding'}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
