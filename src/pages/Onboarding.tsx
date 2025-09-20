import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { PostgrestResponse } from '@supabase/supabase-js';

type Tables = Database['public']['Tables']
type OnboardingTable = Tables['onboarding_responses']
type OnboardingRow = OnboardingTable['Row']
type OnboardingInsert = OnboardingTable['Insert']

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"; // Added FormDescription
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowLeft, ArrowRight, CircleCheckBig, CircleX } from "lucide-react";

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
const budgetRanges = [
  "N100,000 - N150,000",
  "N150,000 - N200,000",
  "N200,000 - N250,000",
  "N250,000 - N300,000",
  "N300,000 - N500,000"
] as const;
const launchTimingOptions = [
  "ASAP",
  "2-4 weeks",
  "2-3 months",
  "4-6 months",
  "1 year"
] as const;
const primaryAudienceOptions = [
  "Consumers",
  "Businesses",
  "Startups",
  "Enterprise",
  "Local Community",
  "International",
] as const;
const likesOptions = [
  "Minimalist",
  "Bold Colors",
  "Luxury Aesthetic",
  "Playful",
  "Techy",
] as const;

// --- helpers ---
const formatNumber = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === "") return "";
  const digits = String(value).replace(/[^0-9]/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const unformatNumber = (value: string): number | undefined => {
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return undefined;
  return Number(digits);
};
const dislikesOptions = [
  "Cluttered Design",
  "Too Formal",
  "Overly Bright Colors",
  "Generic Stock Imagery",
  "Hard to Read Fonts",
] as const;

type Industry = typeof industries[number];
type BudgetRange = typeof budgetRanges[number];
type LaunchTiming = typeof launchTimingOptions[number];
type Platform = typeof platforms[number];
type MarketingGoal = typeof marketingGoals[number];
type BusinessModel = typeof businessModels[number];
type DistributionChannel = typeof distributionChannels[number];
type GeographicFocus = typeof geographicFocusOptions[number];
type Archetype = typeof archetypes[number];

const FormSchema = z.object({
  // Step 1: Basic Brand Info
  brandName: z.string().min(2, "Please enter a name with at least 2 characters.").trim(),
  tagline: z.string().optional().or(z.string().trim()),
  corePromise: z.string().min(10, "Your core promise needs to be at least 10 characters.").optional(),
  archetype: z.enum(archetypes).optional().nullable(),
  senderName: z.string().min(2, "Please enter your name."),
  senderEmail: z.string().email("Please enter a valid email address."),
  
  // Step 2: Identity & Personality
  personalityMasculineFeminine: z.coerce.number().min(0).max(100).default(50),
  personalityPlayfulSerious: z.coerce.number().min(0).max(100).default(50),
  personalityLuxuryAffordable: z.coerce.number().min(0).max(100).default(50),
  personalityClassicModern: z.coerce.number().min(0).max(100).default(50),
  personalityBoldSubtle: z.coerce.number().min(0).max(100).default(50),
  personalityLocalGlobal: z.coerce.number().min(0).max(100).default(50),
  
  // Step 3: Visual Direction
  logoStyle: z.string().min(1, "Please select a logo style."),
  colorPalette: z.string().min(1, "Please select a color palette."),
  typographyFeel: z.string().min(1, "Please select a typography pairing."),
  imageryStyle: z.string().min(1, "Please select an imagery style."),
  moodboardUpload: z.any().optional(),
  
  // Step 4: Audience & Market
  audienceAgeRangeMin: z.coerce.number().min(0).max(100).default(18),
  audienceAgeRangeMax: z.coerce.number().min(0).max(100).default(65),
  audienceGender: z.enum(["Male", "Female", "Mixed"]).default("Mixed"),
  audienceIncomeMin: z.coerce.number().min(0).optional(),
  audienceIncomeMax: z.coerce.number().min(0).optional(),
  currency: z.enum(["NGN","USD","GBP"]).default("NGN"),
  geographicFocus: z.enum(geographicFocusOptions, { required_error: "Please select a geographic focus." }),
  audiencePainPoints: z.string().min(10, "Please describe your audience's pain points (min. 10 characters)."),
  competitors: z.array(z.string()).min(1, "Please add at least one competitor."),
  primaryAudience: z.array(z.string()).optional().default([]),
  primaryAudienceNotes: z.string().optional(),
  
  // Step 5: Positioning & Business
  industry: z.enum(industries, { required_error: "Please select your industry." }),
  usp: z.string().min(10, "Your unique selling proposition needs to be at least 10 characters."),
  differentiation: z.array(z.string()).min(1, "Please add at least one differentiation factor."),
  coreValues: z.array(z.string()).min(1, "Please add at least one core value."),
  visionMission: z.string().min(10, "Your vision/mission needs to be at least 10 characters."),
  oneYearVision: z.string().optional(),
  fiveYearVision: z.string().optional(),
  challenges: z.string().optional(),
  likes: z.array(z.string()).optional().default([]),
  dislikes: z.array(z.string()).optional().default([]),
  
  // Step 6: Products & Services
  offerings: z.array(z.string()).min(1, "Please add at least one product or service."),
  pricePositioning: z.coerce.number().min(0).max(100).default(50), // 0 = Budget, 100 = Premium
  distributionChannels: z.array(z.enum(distributionChannels)).min(1, "Please select at least one distribution channel."),
  businessModel: z.enum(businessModels, { required_error: "Please select a business model." }),
  
  // Step 7: Marketing & Communication
  toneOfVoiceFriendlyFormal: z.coerce.number().min(0).max(100).default(50),
  toneOfVoiceInspirationalPractical: z.coerce.number().min(0).max(100).default(50),
  preferredPlatforms: z.array(z.enum(platforms)).min(1, "Please select at least one platform."),
  marketingGoals: z.array(z.enum(marketingGoals)).min(1, "Please select at least one marketing goal."),
  brandStory: z.string().min(10, "Your brand story needs to be at least 10 characters."),
  
  // Step 8: Technical & Legal
  domain: z.string().optional(),
  hasNoWebsite: z.boolean().default(false),
  socialHandles: z.array(z.string()).optional(),
  trademarkStatus: z.boolean().default(false),
  registrationDocsUpload: z.any().optional(),
  launchTiming: z.enum(launchTimingOptions).optional(),
  budgetRange: z.enum(budgetRanges).optional(),
  
  // Notes Panel (persistent across steps)
  notes: z.string().optional(),
  
});

type FormValues = z.infer<typeof FormSchema>;

// TEMP: Align validation with currently implemented UI steps
const formSteps = [
  { id: 1, name: "Basic Brand Info", fields: ["brandName", "tagline", "corePromise", "archetype", "senderName", "senderEmail"] },
  { id: 2, name: "Identity & Personality", fields: [
    "personalityMasculineFeminine", "personalityPlayfulSerious", "personalityLuxuryAffordable", "personalityClassicModern", "personalityBoldSubtle", "personalityLocalGlobal"
  ] },
  { id: 3, name: "Visual Direction", fields: ["logoStyle", "colorPalette", "typographyFeel", "imageryStyle", "moodboardUpload"] },
  { id: 4, name: "Audience & Market", fields: [
    "audienceAgeRangeMin", "audienceAgeRangeMax", "audienceGender", "audienceIncome", "geographicFocus", "audiencePainPoints", "competitors"
  ] },
  { id: 5, name: "Positioning & Business", fields: ["industry", "usp", "differentiation", "coreValues", "visionMission"] },
  { id: 6, name: "Products & Services", fields: ["offerings", "pricePositioning", "distributionChannels", "businessModel"] },
  { id: 7, name: "Marketing & Communication", fields: ["toneOfVoiceFriendlyFormal", "toneOfVoiceInspirationalPractical", "preferredPlatforms", "marketingGoals", "brandStory"] },
  { id: 8, name: "Technical & Legal", fields: ["domain", "socialHandles", "trademarkStatus", "registrationDocsUpload"] },
];
const totalSteps = formSteps.length;

// --- REUSABLE COMPONENTS ---
const ArrayField = ({ 
  items,
  onAdd,
  onRemove,
  onUpdate,
  addLabel = "Add Item"
}: {
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
  addLabel?: string;
}) => {
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => onUpdate(idx, e.target.value)}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            shape="rounded"
            onClick={() => onRemove(idx)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" size="sm" onClick={onAdd}>
        {addLabel}
      </Button>
    </div>
  );
};

// --- STEP COMPONENTS ---
const Step8 = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <h3 className="text-lg font-semibold mb-4">Technical & Legal</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
      <FormField control={control} name="domain" render={({ field }) => (
          <FormItem className="md:col-span-2">
          <FormLabel>Website Domain</FormLabel>
            <FormControl>
              <Input placeholder="yourbrand.com" disabled={control._formValues?.hasNoWebsite} {...field} />
            </FormControl>
          <FormMessage />
        </FormItem>
      )} />
        <FormField control={control} name="hasNoWebsite" render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">No Website Yet</FormLabel>
            <div className="flex items-center gap-2">
              <Checkbox id="hasNoWebsite" checked={!!field.value} onCheckedChange={(checked) => field.onChange(!!checked)} />
              <label htmlFor="hasNoWebsite" className="text-sm text-muted-foreground">No website yet</label>
            </div>
          </FormItem>
        )} />
      </div>
      <FormField control={control} name="socialHandles" render={({ field }) => (
        <FormItem>
          <FormLabel>Social Handles</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {field.value && field.value.length > 0 && field.value.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input value={item} onChange={e => {
                    const newArr = [...field.value];
                    newArr[idx] = e.target.value;
                    field.onChange(newArr);
                  }} />
                  <Button type="button" variant="destructive" size="sm" className="rounded-md" onClick={() => {
                    const newArr = field.value.filter((_: any, i: number) => i !== idx);
                    field.onChange(newArr);
                  }} aria-label="Remove item" title="Remove">
                    <CircleX className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" size="sm" onClick={() => field.onChange([...(field.value || []), ""])}>Add Handle</Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="trademarkStatus" render={({ field }) => (
        <FormItem>
          <FormLabel>Trademark Status</FormLabel>
          <Select onValueChange={val => field.onChange(val === "true")} defaultValue={field.value ? "true" : "false"}>
            <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="registrationDocsUpload" render={({ field }) => (
        <FormItem>
          <FormLabel>Business Registration Documents</FormLabel>
          <FormControl>
            <Input type="file" accept="application/pdf,image/*" onChange={e => field.onChange(e.target.files?.[0])} />
          </FormControl>
          <FormDescription>Upload business registration or trademark documents (PDF, image).</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="launchTiming" render={({ field }) => (
        <FormItem>
          <FormLabel>Launch Timing</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl><SelectTrigger><SelectValue placeholder="Select launch timing" /></SelectTrigger></FormControl>
            <SelectContent>
              {launchTimingOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormItem>
      )} />
      <FormField control={control} name="budgetRange" render={({ field }) => (
        <FormItem>
          <FormLabel>Budget Range</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl><SelectTrigger><SelectValue placeholder="Select budget range" /></SelectTrigger></FormControl>
            <SelectContent>
              {budgetRanges.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormItem>
      )} />
    </motion.div>
  );
};
const Step7 = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <h3 className="text-lg font-semibold mb-4">Marketing & Communication</h3>
      <FormField control={control} name="toneOfVoiceFriendlyFormal" render={({ field }) => (
        <FormItem>
          <FormLabel>Tone of Voice: Friendly ↔ Formal</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>0</span>
                <span className="font-medium text-foreground">{Number(field.value)}</span>
                <span>100</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Friendly</span>
                <Slider
                  size="sm"
                  min={0}
                  max={100}
                  value={[Number(field.value ?? 0)]}
                  onValueChange={(val) => field.onChange(val[0])}
                />
                <span className="text-xs text-muted-foreground">Formal</span>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="toneOfVoiceInspirationalPractical" render={({ field }) => (
        <FormItem>
          <FormLabel>Tone of Voice: Inspirational ↔ Practical</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>0</span>
                <span className="font-medium text-foreground">{Number(field.value)}</span>
                <span>100</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Inspirational</span>
                <Slider
                  size="sm"
                  min={0}
                  max={100}
                  value={[Number(field.value ?? 0)]}
                  onValueChange={(val) => field.onChange(val[0])}
                />
                <span className="text-xs text-muted-foreground">Practical</span>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="preferredPlatforms" render={({ field }) => (
        <FormItem>
          <FormLabel>Preferred Platforms</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <label key={platform} className="flex items-center gap-2">
                  <Checkbox checked={field.value?.includes(platform)} onCheckedChange={checked => {
                    if (checked) field.onChange([...(field.value || []), platform]);
                    else field.onChange(field.value.filter((p: string) => p !== platform));
                  }} />
                  <span>{platform}</span>
                </label>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="marketingGoals" render={({ field }) => (
        <FormItem>
          <FormLabel>Marketing Goals</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-2">
              {marketingGoals.map((goal) => (
                <label key={goal} className="flex items-center gap-2">
                  <Checkbox checked={field.value?.includes(goal)} onCheckedChange={checked => {
                    if (checked) field.onChange([...(field.value || []), goal]);
                    else field.onChange(field.value.filter((g: string) => g !== goal));
                  }} />
                  <span>{goal}</span>
                </label>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="brandStory" render={({ field }) => (
        <FormItem>
          <FormLabel>Brand Story</FormLabel>
          <FormControl><Textarea placeholder="Share your brand story" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </motion.div>
  );
};
const Step6 = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <h3 className="text-lg font-semibold mb-4">Products & Services</h3>
      <FormField control={control} name="offerings" render={({ field }) => (
        <FormItem>
          <FormLabel>Main Products / Services</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {field.value && field.value.length > 0 && field.value.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input value={item} onChange={e => {
                    const newArr = [...field.value];
                    newArr[idx] = e.target.value;
                    field.onChange(newArr);
                  }} />
                  <Button type="button" variant="destructive" size="sm" className="rounded-md" onClick={() => {
                    const newArr = field.value.filter((_: any, i: number) => i !== idx);
                    field.onChange(newArr);
                  }} aria-label="Remove item" title="Remove">
                    <CircleX className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" size="sm" onClick={() => field.onChange([...(field.value || []), ""])}>Add Offering</Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="pricePositioning" render={({ field }) => (
        <FormItem>
          <FormLabel>Price Positioning (Budget ↔ Premium)</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>0</span>
                <span className="font-medium text-foreground">{Number(field.value)}</span>
                <span>100</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Budget</span>
                <Slider
                  size="sm"
                  min={0}
                  max={100}
                  value={[Number(field.value ?? 0)]}
                  onValueChange={(val) => field.onChange(val[0])}
                />
                <span className="text-xs text-muted-foreground">Premium</span>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="distributionChannels" render={({ field }) => (
        <FormItem>
          <FormLabel>Distribution Channels</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-2">
              {distributionChannels.map((channel) => (
                <label key={channel} className="flex items-center gap-2">
                  <Checkbox checked={field.value?.includes(channel)} onCheckedChange={checked => {
                    if (checked) field.onChange([...(field.value || []), channel]);
                    else field.onChange(field.value.filter((c: string) => c !== channel));
                  }} />
                  <span>{channel}</span>
                </label>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="businessModel" render={({ field }) => (
        <FormItem>
          <FormLabel>Business Model</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl><SelectTrigger><SelectValue placeholder="Select business model" /></SelectTrigger></FormControl>
            <SelectContent>
              {businessModels.map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />
    </motion.div>
  );
};
const Step5 = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <h3 className="text-lg font-semibold mb-4">Positioning & Business</h3>
      <FormField control={control} name="industry" render={({ field }) => (
        <FormItem>
          <FormLabel>Industry</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl><SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger></FormControl>
            <SelectContent>
              {industries.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="usp" render={({ field }) => (
        <FormItem>
          <FormLabel>Unique Selling Proposition</FormLabel>
          <FormControl><Textarea placeholder="What makes you unique?" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="likes" render={({ field }) => (
        <FormItem>
          <FormLabel>What do you like?</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-3">
              {likesOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value?.includes(opt)}
                    onCheckedChange={(checked) => {
                      if (checked) field.onChange([...(field.value || []), opt]);
                      else field.onChange((field.value || []).filter((v: string) => v !== opt));
                    }}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </FormControl>
        </FormItem>
      )} />
      <FormField control={control} name="dislikes" render={({ field }) => (
        <FormItem>
          <FormLabel>What do you dislike?</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-3">
              {dislikesOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value?.includes(opt)}
                    onCheckedChange={(checked) => {
                      if (checked) field.onChange([...(field.value || []), opt]);
                      else field.onChange((field.value || []).filter((v: string) => v !== opt));
                    }}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </FormControl>
        </FormItem>
      )} />
      <FormField control={control} name="oneYearVision" render={({ field }) => (
        <FormItem>
          <FormLabel>1-Year Vision</FormLabel>
          <FormControl><Textarea placeholder="Where do you want to be in 1 year?" {...field} /></FormControl>
        </FormItem>
      )} />
      <FormField control={control} name="fiveYearVision" render={({ field }) => (
        <FormItem>
          <FormLabel>5-Year Vision</FormLabel>
          <FormControl><Textarea placeholder="Where do you want to be in 5 years?" {...field} /></FormControl>
        </FormItem>
      )} />
      <FormField control={control} name="challenges" render={({ field }) => (
        <FormItem>
          <FormLabel>Biggest Challenges</FormLabel>
          <FormControl><Textarea placeholder="What stands in your way right now?" {...field} /></FormControl>
        </FormItem>
      )} />
      <FormField control={control} name="differentiation" render={({ field }) => (
        <FormItem>
          <FormLabel>Differentiation Factors</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {field.value && field.value.length > 0 && field.value.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input value={item} onChange={e => {
                    const newArr = [...field.value];
                    newArr[idx] = e.target.value;
                    field.onChange(newArr);
                  }} />
                  <Button type="button" variant="ghost" size="sm" shape="rounded" onClick={() => {
                    const newArr = field.value.filter((_: any, i: number) => i !== idx);
                    field.onChange(newArr);
                  }} aria-label="Remove item" title="Remove">
                    <CircleX className="h-5 w-5 text-black" />
                  </Button>
                </div>
              ))}
              <Button type="button" size="sm" onClick={() => field.onChange([...(field.value || []), ""])}>Add Factor</Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="coreValues" render={({ field }) => (
        <FormItem>
          <FormLabel>Core Values</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {field.value && field.value.length > 0 && field.value.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input value={item} onChange={e => {
                    const newArr = [...field.value];
                    newArr[idx] = e.target.value;
                    field.onChange(newArr);
                  }} />
                  <Button type="button" variant="ghost" size="sm" shape="rounded" onClick={() => {
                    const newArr = field.value.filter((_: any, i: number) => i !== idx);
                    field.onChange(newArr);
                  }} aria-label="Remove item" title="Remove">
                    <CircleX className="h-5 w-5 text-black" />
                  </Button>
                </div>
              ))}
              <Button type="button" size="sm" onClick={() => field.onChange([...(field.value || []), ""])}>Add Value</Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="visionMission" render={({ field }) => (
        <FormItem>
          <FormLabel>Vision & Mission</FormLabel>
          <FormControl><Textarea placeholder="Describe your vision and mission" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </motion.div>
  );
};

const Step1 = () => {
  const { control, formState: { errors } } = useFormContext<FormValues>();
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


const Step4 = () => {
  const { control, setValue, getValues } = useFormContext<FormValues>();
  const competitors = getValues("competitors") || [];
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <h3 className="text-lg font-semibold mb-4">Audience & Market</h3>
      <FormField control={control} name="audienceAgeRangeMin" render={({ field }) => (
        <FormItem>
          <FormLabel>Audience Age Range (Min)</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>0</span>
                <span className="font-medium text-foreground">{Number(field.value)}</span>
                <span>100</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Young</span>
                <Slider
                  size="sm"
                  min={0}
                  max={100}
                  value={[Number(field.value ?? 0)]}
                  onValueChange={(val) => field.onChange(val[0])}
                />
                <span className="text-xs text-muted-foreground">Older</span>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="audienceAgeRangeMax" render={({ field }) => (
        <FormItem>
          <FormLabel>Audience Age Range (Max)</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>0</span>
                <span className="font-medium text-foreground">{Number(field.value)}</span>
                <span>100</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Young</span>
                <Slider
                  size="sm"
                  min={0}
                  max={100}
                  value={[Number(field.value ?? 0)]}
                  onValueChange={(val) => field.onChange(val[0])}
                />
                <span className="text-xs text-muted-foreground">Older</span>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="audienceGender" render={({ field }) => (
        <FormItem>
          <FormLabel>Audience Gender</FormLabel>
          <FormControl>
            <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-wrap gap-4">
              {(["Male","Female","Mixed"] as const).map(opt => (
                <label key={opt} className="flex items-center gap-2">
                  <RadioGroupItem value={opt} />
                  <span>{opt}</span>
                </label>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <FormField control={control} name="currency" render={({ field }) => (
          <FormItem className="md:col-span-1">
            <FormLabel>Currency</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">₦ NGN</SelectItem>
                  <SelectItem value="USD">$ USD</SelectItem>
                  <SelectItem value="GBP">£ GBP</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )} />
        <FormField control={control} name="audienceIncomeMin" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Audience Income (Min)</FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="e.g., 50,000"
                value={field.value === undefined ? "" : formatNumber(field.value)}
                onChange={(e) => field.onChange(unformatNumber(e.target.value))}
              />
            </FormControl>
          <FormMessage />
        </FormItem>
      )} />
        <FormField control={control} name="audienceIncomeMax" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Audience Income (Max)</FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="e.g., 200,000"
                value={field.value === undefined ? "" : formatNumber(field.value)}
                onChange={(e) => field.onChange(unformatNumber(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <FormField control={control} name="geographicFocus" render={({ field }) => (
        <FormItem>
          <FormLabel>Geographic Focus</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl><SelectTrigger><SelectValue placeholder="Select geographic focus" /></SelectTrigger></FormControl>
            <SelectContent>
              {geographicFocusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="audiencePainPoints" render={({ field }) => (
        <FormItem>
          <FormLabel>Audience Pain Points</FormLabel>
          <FormControl><Textarea placeholder="Describe your audience's pain points" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={control} name="primaryAudience" render={({ field }) => (
        <FormItem>
          <FormLabel>Primary Audience</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-3">
                {primaryAudienceOptions.map(opt => (
                  <label key={opt} className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value?.includes(opt)}
                      onCheckedChange={(checked) => {
                        if (checked) field.onChange([...(field.value || []), opt]);
                        else field.onChange((field.value || []).filter((v: string) => v !== opt));
                      }}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </FormControl>
        </FormItem>
      )} />
      <FormField control={control} name="primaryAudienceNotes" render={({ field }) => (
        <FormItem>
          <FormLabel>Primary Audience Notes</FormLabel>
          <FormControl><Textarea placeholder="Add more details about your audience" {...field} /></FormControl>
        </FormItem>
      )} />
      <div>
        <FormLabel>Competitors</FormLabel>
        <FormField control={control} name="competitors" render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="space-y-2">
                {field.value && field.value.length > 0 && field.value.map((comp: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={comp} onChange={e => {
                      const newComps = [...field.value];
                      newComps[idx] = e.target.value;
                      field.onChange(newComps);
                    }} />
                    <Button type="button" variant="destructive" size="sm" onClick={() => {
                      const newComps = field.value.filter((_: any, i: number) => i !== idx);
                      field.onChange(newComps);
                    }} aria-label="Remove item" title="Remove">
                      <CircleX className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" size="sm" onClick={() => field.onChange([...(field.value || []), ""])}>Add Competitor</Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
    </motion.div>
  );
};

const FinalStep = () => (
  <motion.div className="text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
    <CircleCheckBig className="mx-auto h-16 w-16 text-[#e2a312]" />
    <h2 className="mt-4 text-2xl font-bold">You're All Set!</h2>
    <p className="mt-2 text-muted-foreground">
      You've laid the foundation. Click 'Submit Onboarding' to send your brand details.
    </p>
  </motion.div>
);


// --- MAIN FORM COMPONENT ---

// --- NOTES PANEL COMPONENT ---
const NotesPanel = () => {
  const { control } = useFormContext<FormValues>();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <motion.div 
      className="fixed right-4 top-24 w-80 z-50 bg-background border rounded-lg shadow-lg overflow-hidden"
      initial={{ x: 320 }}
      animate={{ x: isCollapsed ? 280 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-4 border-b flex justify-between items-center bg-primary/5">
        <h3 className="font-semibold">Notes</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
      <div className="p-4">
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add notes about this brand..."
                  className="min-h-[200px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                These notes will be saved with the brand profile
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
};

// --- MAIN FORM COMPONENT ---
export default function OnboardingForm() {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [showNotesPanel, setShowNotesPanel] = React.useState(true);
  
  // Load saved form data from session storage on initial render
  const loadSavedFormData = () => {
    try {
      const savedData = sessionStorage.getItem('onboardingFormData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Normalize legacy fields and remove deprecated ones
        if (typeof parsed.audienceIncome !== 'undefined') {
          delete parsed.audienceIncome;
        }
        if (typeof parsed.audienceIncomeMin === 'string') {
          parsed.audienceIncomeMin = Number(String(parsed.audienceIncomeMin).replace(/[^0-9]/g, '')) || undefined;
        }
        if (typeof parsed.audienceIncomeMax === 'string') {
          parsed.audienceIncomeMax = Number(String(parsed.audienceIncomeMax).replace(/[^0-9]/g, '')) || undefined;
        }
        if (!parsed.currency) parsed.currency = 'NGN';
        return parsed;
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
    return null;
  };

  const methods = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: loadSavedFormData() || {
      // Step 1
      brandName: "",
      corePromise: "",
      tagline: "",
      archetype: null,
      senderName: "", 
      senderEmail: "",
      
      // Step 2
      personalityMasculineFeminine: 50,
      personalityPlayfulSerious: 50,
      personalityLuxuryAffordable: 50,
      personalityClassicModern: 50,
      personalityBoldSubtle: 50,
      personalityLocalGlobal: 50,
      
      // Step 3
      logoStyle: undefined,
      colorPalette: undefined,
      typographyFeel: undefined,
      imageryStyle: undefined,
      moodboardUpload: undefined,
      
      // Step 4
      audienceAgeRangeMin: 18,
      audienceAgeRangeMax: 65,
      audienceGender: 50,
      audienceIncomeMin: undefined,
      audienceIncomeMax: undefined,
      currency: "NGN",
      geographicFocus: undefined,
      audiencePainPoints: "",
      competitors: [],
      
      // Step 5
      industry: undefined,
      usp: "",
      differentiation: [],
      coreValues: [],
      visionMission: "",
      oneYearVision: "",
      fiveYearVision: "",
      challenges: "",
      likesDislikes: "",
      
      // Step 6
      offerings: [],
      pricePositioning: 50,
      distributionChannels: [],
      businessModel: undefined,
      
      // Step 7
      toneOfVoiceFriendlyFormal: 50,
      toneOfVoiceInspirationalPractical: 50,
      preferredPlatforms: [],
      marketingGoals: [],
      brandStory: "",
      
      // Step 8
      domain: "",
      hasNoWebsite: false,
      socialHandles: [],
      trademarkStatus: false,
      registrationDocsUpload: undefined,
      launchTiming: "",
      budgetRange: "",
      
      // Notes
      notes: "",
    },
  });

  // If navigated with editOnboardingId in location.state, load onboarding response and populate the form
  React.useEffect(() => {
    const editId = (location.state as any)?.editOnboardingId;
    if (!editId) return;

    const fetchAndPopulate = async () => {
      try {
        const { data, error } = await supabase
          .from('onboarding_responses')
          .select('*')
          .eq('id', editId)
          .single();

        if (error) throw error;
        if (!data) return;

        // Map DB fields to form values safely
        const mapped: Partial<FormValues> = {
          brandName: data.brand_name || "",
          tagline: data.tagline || "",
          corePromise: data.elevator_pitch || "",
          industry: (data.industry as any) || undefined,
          offerings: data.offerings ? String(data.offerings).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
          // audience
          primaryAudience: data.primary_audience ? String(data.primary_audience).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
          oneYearVision: (data.one_year_vision as any) || "",
          // planning
          budgetRange: (data.budget_range as any) || undefined,
          launchTiming: (data.launch_timing as any) || undefined,
          // visual direction
          logoStyle: (data.brand_personality as any)?.logoStyle || undefined,
          colorPalette: (data.brand_personality as any)?.colorPalette || undefined,
          typographyFeel: (data.brand_personality as any)?.typographyFeel || undefined,
          imageryStyle: (data.brand_personality as any)?.imageryStyle || undefined,
        };

        // If brand_personality object exists, map personality fields
        const bp = (data as any).brand_personality;
        if (bp) {
          mapped.personalityMasculineFeminine = bp.masculineFeminine ?? mapped.personalityMasculineFeminine;
          mapped.personalityPlayfulSerious = bp.playfulSerious ?? mapped.personalityPlayfulSerious;
          mapped.personalityLuxuryAffordable = bp.luxuryAffordable ?? mapped.personalityLuxuryAffordable;
          mapped.personalityClassicModern = bp.classicModern ?? mapped.personalityClassicModern;
          mapped.personalityBoldSubtle = bp.boldSubtle ?? mapped.personalityBoldSubtle;
          mapped.personalityLocalGlobal = bp.localGlobal ?? mapped.personalityLocalGlobal;
          mapped.likes = bp.likes ?? [];
          mapped.dislikes = bp.dislikes ?? [];
          mapped.oneYearVision = bp.oneYearVision ?? mapped.oneYearVision;
          mapped.fiveYearVision = bp.fiveYearVision ?? mapped.fiveYearVision;
          mapped.challenges = bp.challenges ?? mapped.challenges;
        }

        // Competitors may be stored in different field names
        const comps = (data as any).competitors || (data as any).competitor_list;
        if (comps) mapped.competitors = String(comps).split(',').map((s: string) => s.trim()).filter(Boolean);

        // age_range and income_level parsing
        if ((data as any).age_range) {
          const [min, max] = String((data as any).age_range).split('-').map((v: string) => Number(v));
          if (!Number.isNaN(min)) (mapped as any).audienceAgeRangeMin = min;
          if (!Number.isNaN(max)) (mapped as any).audienceAgeRangeMax = max;
        }
        if ((data as any).income_level) {
          const [min, max] = String((data as any).income_level).split('-').map((v: string) => Number(v));
          if (!Number.isNaN(min)) (mapped as any).audienceIncomeMin = min;
          if (!Number.isNaN(max)) (mapped as any).audienceIncomeMax = max;
        }

        // Notes
        if ((data as any).notes) mapped.notes = (data as any).notes;

        methods.reset({ ...methods.getValues(), ...mapped });
        // set step to 1 so user starts from beginning when editing
        setStep(1);
      } catch (err) {
        console.error('Failed to load onboarding for edit:', err);
        toast({ title: 'Error', description: 'Failed to load brand data for editing.', variant: 'destructive' });
      }
    };

    fetchAndPopulate();
    // clear location state to avoid re-fetch on remount
    try {
      (history.replaceState as any)(null, '', location.pathname);
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  
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
    try {
      const currentStepConfig = formSteps.find(s => s.id === step);
      const fields = currentStepConfig?.fields || [];
      
      // If no fields to validate, just move to next step
      if (fields.length === 0) {
        setStep(prev => Math.min(prev + 1, totalSteps + 1));
        return;
      }

      // Trigger validation only for the current step's fields
      const isValid = await methods.trigger(fields as (keyof FormValues)[]);
      
      if (isValid) {
        setStep(prev => Math.min(prev + 1, totalSteps + 1));
        // Save current step to session storage
        sessionStorage.setItem('onboardingFormStep', String(step + 1));
      } else {
        // Show error toast if validation fails
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields for this step.",
          variant: "destructive"
        });
        
        // Log the current form state and errors for debugging
        console.log('Current form state:', methods.getValues());
        console.log('Form errors:', methods.formState.errors);
      }
    } catch (error) {
      console.error('Error in nextStep:', error);
      toast({
        title: "Error",
        description: "An error occurred while validating the form.",
        variant: "destructive"
      });
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
      // Transform form data to match Supabase schema
      const insertData: OnboardingInsert = {
        user_id: user.id,
        brand_name: values.brandName || null,
        tagline: values.tagline || null,
        elevator_pitch: values.corePromise || null,
        industry: values.industry || null,
        usp: values.usp || null,
        online_link: values.hasNoWebsite ? null : (values.domain || null),
        offerings: values.offerings?.length ? values.offerings.join(", ") : null,
        competitors: values.competitors.join(", "),
        primary_audience: values.primaryAudience?.join(", ") || values.primaryAudienceNotes || null,
        age_range: `${values.audienceAgeRangeMin}-${values.audienceAgeRangeMax}`,
        gender_focus: values.audienceGender,
        income_level: values.audienceIncomeMin && values.audienceIncomeMax ? `${values.audienceIncomeMin}-${values.audienceIncomeMax}` : null,
        launch_timing: values.launchTiming || null,
        budget_range: values.budgetRange || null,
        one_year_vision: values.oneYearVision || null,
        five_year_vision: values.fiveYearVision || null,
        challenges: values.challenges || null,
        extra_notes: values.notes || null,
        likes_dislikes: values.likes?.length || values.dislikes?.length ? 
          `Likes: ${values.likes?.join(", ") || "None"}; Dislikes: ${values.dislikes?.join(", ") || "None"}` : null,
        brand_personality: {
          // Personality sliders
          masculineFeminine: values.personalityMasculineFeminine,
          playfulSerious: values.personalityPlayfulSerious,
          luxuryAffordable: values.personalityLuxuryAffordable,
          classicModern: values.personalityClassicModern,
          boldSubtle: values.personalityBoldSubtle,
          localGlobal: values.personalityLocalGlobal,
          
          // Visual direction
          logoStyle: values.logoStyle,
          colorPalette: values.colorPalette,
          typographyFeel: values.typographyFeel,
          imageryStyle: values.imageryStyle,
          
          // Audience details
          geographicFocus: values.geographicFocus,
          audiencePainPoints: values.audiencePainPoints,
          
          // Business details
          visionMission: values.visionMission,
          differentiation: values.differentiation,
          coreValues: values.coreValues,
          pricePositioning: values.pricePositioning,
          distributionChannels: values.distributionChannels,
          businessModel: values.businessModel,
          
          // Marketing & Communication
          toneFriendlyFormal: values.toneOfVoiceFriendlyFormal,
          toneInspirationalPractical: values.toneOfVoiceInspirationalPractical,
          preferredPlatforms: values.preferredPlatforms,
          marketingGoals: values.marketingGoals,
          brandStory: values.brandStory,
          
          // Technical & Legal
          socialHandles: values.socialHandles,
          trademarkStatus: values.trademarkStatus,
          
          // Meta
          meta: {
            hasNoWebsite: values.hasNoWebsite === true,
            currency: values.currency
          }
        }
      };

      // Save to Supabase with type assertion
      const supabaseResponse = await supabase
        .from('onboarding_responses')
        .insert<OnboardingInsert>([insertData] as OnboardingInsert[])
        .select()
        .single();
      
      const { data, error } = supabaseResponse;
        
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      console.log('Successfully saved onboarding data:', data);
      
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

          {/* Notes Panel Toggle */}
          <div className="flex justify-end mb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNotesPanel(!showNotesPanel)}
            >
              {showNotesPanel ? "Hide Notes" : "Show Notes"}
            </Button>
          </div>
          
          {/* Notes Panel */}
          {showNotesPanel && <NotesPanel />}

          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              {step === 1 && <Step1 key="step1" />}
              {step === 2 && <Step2 key="step2" />}
              {step === 3 && <Step3 key="step3" />}
              {step === 4 && <Step4 key="step4" />}
              {step === 5 && <Step5 key="step5" />}
              {step === 6 && <Step6 key="step6" />}
              {step === 7 && <Step7 key="step7" />}
              {step === 8 && <Step8 key="step8" />}
              {step === 9 && <FinalStep key="final-step" />}
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
              <div className="flex w-full gap-3">
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1" shape="rounded">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit" variant="premium" disabled={loading || authLoading} className="flex-1" shape="rounded">
                {loading || authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Submit Onboarding'}
              </Button>
              </div>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
