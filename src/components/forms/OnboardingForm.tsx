import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { HelpCircle, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generateBrandPersonalitySnapshotPDF, type BrandSnapshot } from "@/lib/pdf";
import { useNavigate } from "react-router-dom";

const industries = [
  "Technology",
  "E-commerce",
  "Health & Wellness",
  "Finance",
  "Education",
  "Hospitality",
  "Real Estate",
  "Fashion",
  "Food & Beverage",
  "Agency/Consulting",
  "Other",
] as const;

const audienceOptions = [
  "Consumers (B2C)",
  "Businesses (B2B)",
  "Investors",
  "Non-profits",
  "Creators/Influencers",
  "Internal Team",
  "High Net-Worth Individuals",
  "Startups",
  "Enterprise",
  "Local Community",
] as const;

const ageOptions = ["Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"] as const;
const genderOptions = ["Male", "Female", "Non-binary", "All"] as const;
const incomeOptions = ["Budget", "Mid-range", "Premium", "Luxury"] as const;

const launchOptions = ["ASAP", "1-3 months", "3-6 months", "6+ months", "Flexible"] as const;
const budgetOptions = ["<$2k", "$2k-$5k", "$5k-$10k", "$10k-$25k", "$25k+"] as const;

const FormSchema = z.object({
  // Step 1: Brand Basics
  brandName: z.string().min(1, "Please enter your brand or business name"),
  tagline: z.string().optional(),
  onlineLink: z.string().url("Enter a valid URL").optional().or(z.literal("")).optional(),
  elevator: z.string().min(10, "Describe your business in one sentence"),

  // Step 2: Business DNA
  industry: z.enum(industries, { required_error: "Select your industry" }),
  offerings: z.string().min(3, "List your products or services"),
  usp: z.string().min(3, "Tell me what makes you impossible to ignore"),
  problem: z.string().min(3, "Describe the problem you solve"),

  // Step 3: Target Audience
  audiencePrimary: z.array(z.enum(audienceOptions)).min(1, "Pick at least one primary audience"),
  ageRanges: z.array(z.enum(ageOptions)).min(1, "Pick at least one age range"),
  genderFocus: z.array(z.enum(genderOptions)).min(1, "Pick at least one gender focus"),
  incomeLevels: z.array(z.enum(incomeOptions)).min(1, "Pick at least one income level"),

  // Step 4: Brand Personality & Style (0-100)
  masculine: z.number().min(0).max(100),
  classic: z.number().min(0).max(100),
  playful: z.number().min(0).max(100),
  loud: z.number().min(0).max(100),
  approachable: z.number().min(0).max(100),
  warm: z.number().min(0).max(100),
  traditional: z.number().min(0).max(100),
  luxury: z.number().min(0).max(100),
  textFocused: z.number().min(0).max(100),
  corporate: z.number().min(0).max(100),

  // Step 5: Inspiration
  inspirationFiles: z.any().optional(),
  brandColors: z.array(z.string()).optional(),
  fontsLoved: z.string().optional(),

  // Step 6: Competition & Positioning
  competitor1: z.string().optional(),
  competitor2: z.string().optional(),
  competitor3: z.string().optional(),
  compLike: z.string().optional(),
  compDislike: z.string().optional(),

  // Step 7: Vision & Goals
  vision1y: z.string().min(3, "Share your 1 year vision"),
  vision5y: z.string().min(3, "Share your 5 year vision"),
  challenge: z.string().min(3, "What's your biggest branding challenge?"),

  // Step 8: Logistics & Budget
  launchTiming: z.enum(launchOptions, { required_error: "Pick a timing" }),
  budgetRange: z.enum(budgetOptions, { required_error: "Pick a budget" }),

  // Step 9: Extra Insight
  extraNotes: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function OnboardingForm() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [completed, setCompleted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const total = 10; // final screen included

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      brandName: "",
      tagline: "",
      onlineLink: "",
      elevator: "",
      industry: undefined as unknown as FormValues["industry"],
      offerings: "",
      usp: "",
      problem: "",
      audiencePrimary: [],
      ageRanges: [],
      genderFocus: [],
      incomeLevels: [],
      masculine: 50,
      classic: 50,
      playful: 50,
      loud: 50,
      approachable: 50,
      warm: 50,
      traditional: 50,
      luxury: 50,
      textFocused: 50,
      corporate: 50,
      inspirationFiles: undefined,
      brandColors: ["#C5A572", "#000000", "#FFFFFF"],
      fontsLoved: "",
      competitor1: "",
      competitor2: "",
      competitor3: "",
      compLike: "",
      compDislike: "",
      vision1y: "",
      vision5y: "",
      challenge: "",
      launchTiming: undefined as unknown as FormValues["launchTiming"],
      budgetRange: undefined as unknown as FormValues["budgetRange"],
      extraNotes: "",
    },
  });

  const next = async () => {
    const fieldsByStep: Record<number, (keyof FormValues)[]> = {
      1: ["brandName", "elevator"],
      2: ["industry", "offerings", "usp", "problem"],
      3: ["audiencePrimary", "ageRanges", "genderFocus", "incomeLevels"],
      4: ["masculine", "classic", "playful", "loud", "approachable", "warm", "traditional", "luxury", "textFocused", "corporate"],
      5: [],
      6: [],
      7: ["vision1y", "vision5y", "challenge"],
      8: ["launchTiming", "budgetRange"],
      9: [],
    };
    const fields = fieldsByStep[step] || [];
    const valid = fields.length ? await form.trigger(fields as any) : true;
    if (valid) setStep(Math.min(total, step + 1));
  };

  const back = () => setStep(Math.max(1, step - 1));

  const uploadInspirationFiles = async (files: File[]) => {
    try {
      if (!files?.length) return [] as string[];
      const uploads = await Promise.all(
        files.map(async (file) => {
          const path = `anonymous/${Date.now()}-${file.name}`;
          const { error } = await supabase.storage.from("inspiration").upload(path, file);
          if (error) return "";
          const { data } = supabase.storage.from("inspiration").getPublicUrl(path);
          return data.publicUrl || "";
        })
      );
      return uploads.filter(Boolean);
    } catch {
      return [] as string[];
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      const files = (values.inspirationFiles as File[] | undefined) || [];
      const fileUrls = await uploadInspirationFiles(files);
      const sessionId = Date.now().toString();

      // Prepare the data for insertion according to our schema
      const insertData = {
        user_id: null, // Will be linked after user signs up
        session_id: sessionId,
        brand_name: values.brandName,
        tagline: values.tagline,
        online_link: values.onlineLink,
        elevator_pitch: values.elevator,
        industry: values.industry,
        offerings: values.offerings,
        usp: values.usp,
        problem_solved: values.problem,
        primary_audience: values.audiencePrimary.join(", "),
        age_range: values.ageRanges.join(", "),
        gender_focus: values.genderFocus.join(", "),
        income_level: values.incomeLevels.join(", "),
        brand_personality: {
          masculine: values.masculine,
          classic: values.classic,
          playful: values.playful,
          loud: values.loud,
          approachable: values.approachable,
          warm: values.warm,
          traditional: values.traditional,
          luxury: values.luxury,
          textFocused: values.textFocused,
          corporate: values.corporate,
        },
        inspiration_files: fileUrls,
        brand_colors: values.brandColors,
        fonts: values.fontsLoved ? [values.fontsLoved] : [],
        competitors: [values.competitor1, values.competitor2, values.competitor3].filter(Boolean).join(", "),
        likes_dislikes: `Likes: ${values.compLike || 'N/A'}\nDislikes: ${values.compDislike || 'N/A'}`,
        one_year_vision: values.vision1y,
        five_year_vision: values.vision5y,
        challenges: values.challenge,
        launch_timing: values.launchTiming,
        budget_range: values.budgetRange,
        extra_notes: values.extraNotes,
      };

      const { error } = await supabase.from("onboarding_responses").insert(insertData);
      
      if (error) {
        throw error;
      }

      const snapshot: BrandSnapshot = {
        basics: {
          name: values.brandName,
          tagline: values.tagline,
          link: values.onlineLink,
          elevator: values.elevator,
        },
        sliders: [
          { label: "Masculine ↔ Feminine", value: values.masculine, left: "Masculine", right: "Feminine" },
          { label: "Classic ↔ Modern", value: values.classic, left: "Classic", right: "Modern" },
          { label: "Playful ↔ Serious", value: values.playful, left: "Playful", right: "Serious" },
          { label: "Loud ↔ Minimal", value: values.loud, left: "Loud", right: "Minimal" },
          { label: "Approachable ↔ Exclusive", value: values.approachable, left: "Approachable", right: "Exclusive" },
          { label: "Warm ↔ Cool", value: values.warm, left: "Warm", right: "Cool" },
          { label: "Traditional ↔ Innovative", value: values.traditional, left: "Traditional", right: "Innovative" },
          { label: "Luxury ↔ Budget-Friendly", value: values.luxury, left: "Luxury", right: "Budget" },
          { label: "Text-Focused ↔ Image-Focused", value: values.textFocused, left: "Text", right: "Image" },
          { label: "Corporate ↔ Artistic", value: values.corporate, left: "Corporate", right: "Artistic" },
        ],
        keyAnswers: [
          { question: "USP", answer: values.usp },
          { question: "Problem you solve", answer: values.problem },
          { question: "Primary Audience", answer: values.audiencePrimary.join(", ") },
          { question: "Vision (1Y)", answer: values.vision1y },
          { question: "Vision (5Y)", answer: values.vision5y },
          { question: "Challenge", answer: values.challenge },
        ],
      };

      const pdf = generateBrandPersonalitySnapshotPDF(snapshot);
      const blob = new Blob([pdf], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${values.brandName.replace(/\s+/g, "_")}_Brand_Snapshot.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "You’ve started your Empire.",
        description: "Your answers are the blueprint. Next: book your strategy session.",
      });
      setCompleted(true);
      setStep(10);
    } catch (e) {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" as any });
    }
  };

  const progress = Math.min((step / total) * 100, 100);

  const LabelWithTip = ({ label, tip }: { label: string; tip: string }) => (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="size-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm leading-relaxed">{tip}</TooltipContent>
      </Tooltip>
    </div>
  );

  const renderSlider = (
    name: keyof FormValues,
    label: string,
    left: string,
    right: string,
    help: string
  ) => (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <LabelWithTip label={label} tip={help} />
          </FormLabel>
          <div className="flex items-center gap-4">
            <span className="w-20 text-xs text-muted-foreground">{left}</span>
            <Slider
              value={[Number(field.value) || 0]}
              onValueChange={(v) => field.onChange(v[0])}
              max={100}
              step={1}
            />
            <span className="w-20 text-right text-xs text-muted-foreground">{right}</span>
          </div>
          <FormDescription>Value: {field.value}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="mx-auto max-w-3xl rounded-xl border bg-card p-6">
      <div className="mb-4">
        <Progress value={progress} />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Brand Basics */}
          {step === 1 && (
            <div className="space-y-6 animate-enter">
              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTip
                        label="What’s your brand or business name?"
                        tip="Every empire needs a name. If you don’t have one yet, type ‘TBD’ — we’ll forge one together."
                      />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="KING, Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTip
                        label="Do you have a tagline or slogan? (Optional)"
                        tip="Think of this as your battle cry — short, punchy, unforgettable. If you don’t have one, leave it blank."
                      />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Design that rules." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="onlineLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTip
                        label="Where can I see you online? (Website or social link)"
                        tip="If your current presence is messy — don’t worry. That’s why you’re here."
                      />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="elevator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTip
                        label="Describe your business in one sentence — like you’re telling a stranger in an elevator."
                        tip="Clarity is currency. If you can’t explain it simply, your customers won’t get it."
                      />
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="We help X do Y so they can Z." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 2: Business DNA */}
          {step === 2 && (
            <div className="space-y-6 animate-enter">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTip
                        label="What industry are you in?"
                        tip="Knowing your battlefield tells me which weapons (and visuals) we’ll bring to the fight."
                      />
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full md:w-80">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="offerings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTip
                        label="What products or services do you offer?"
                        tip="Lay it out. Don’t hold back — every detail counts."
                      />
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="List your key products/services" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTip
                        label="What makes you impossible to ignore? (USP)"
                        tip="If someone asked me why you’re different, what should I say? Be specific. Be bold."
                      />
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Your differentiation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTip
                        label="What problem do you solve?"
                        tip="This is your real business — not the product you sell, but the pain you remove."
                      />
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="The core pain you remove" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 3: Target Audience */}
          {step === 3 && (
            <div className="space-y-6 animate-enter">
              <FormField
                control={form.control}
                name="audiencePrimary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTip
                        label="Who’s your primary audience? (Choose all that apply)"
                        tip="We’re not trying to be everything to everyone — we’re building for your people."
                      />
                    </FormLabel>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {audienceOptions.map((opt) => (
                        <label key={opt} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={field.value?.includes(opt as any)}
                            onCheckedChange={(c) =>
                              c
                                ? field.onChange([...(field.value || []), opt])
                                : field.onChange((field.value || []).filter((v) => v !== opt))
                            }
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ageRanges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTip label="What’s their age range?" tip="Age isn’t just a number — it’s a design language." />
                    </FormLabel>
                    <div className="flex flex-wrap gap-3">
                      {ageOptions.map((opt) => (
                        <label key={opt} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={field.value?.includes(opt as any)}
                            onCheckedChange={(c) =>
                              c
                                ? field.onChange([...(field.value || []), opt])
                                : field.onChange((field.value || []).filter((v) => v !== opt))
                            }
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="genderFocus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <LabelWithTip label="Gender focus?" tip="Colors, shapes, tone — gender focus influences everything from font weight to copy style." />
                      </FormLabel>
                      <div className="flex flex-wrap gap-3">
                        {genderOptions.map((opt) => (
                          <label key={opt} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={field.value?.includes(opt as any)}
                              onCheckedChange={(c) =>
                                c
                                  ? field.onChange([...(field.value || []), opt])
                                  : field.onChange((field.value || []).filter((v) => v !== opt))
                              }
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incomeLevels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <LabelWithTip label="Income level?" tip="Budget brands talk different from luxury brands. I need to know your voice." />
                      </FormLabel>
                      <div className="flex flex-wrap gap-3">
                        {incomeOptions.map((opt) => (
                          <label key={opt} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={field.value?.includes(opt as any)}
                              onCheckedChange={(c) =>
                                c
                                  ? field.onChange([...(field.value || []), opt])
                                  : field.onChange((field.value || []).filter((v) => v !== opt))
                              }
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 4: Brand Personality & Style */}
          {step === 4 && (
            <div className="space-y-6 animate-enter">
              {renderSlider("masculine", "Masculine ↔ Feminine", "Masculine", "Feminine", "From strong and bold to soft and elegant — where do you sit?")}
              {renderSlider("classic", "Classic ↔ Modern", "Classic", "Modern", "Are we timeless like Rolex or cutting-edge like Tesla?")}
              {renderSlider("playful", "Playful ↔ Serious", "Playful", "Serious", "Do you want to make people smile or make them feel the weight of your authority?")}
              {renderSlider("loud", "Loud ↔ Minimal", "Loud", "Minimal", "Big colors and big presence, or quiet power in clean lines?")}
              {renderSlider("approachable", "Approachable ↔ Exclusive", "Approachable", "Exclusive", "Welcoming like Starbucks or rare like a private members’ club?")}
              {renderSlider("warm", "Warm ↔ Cool", "Warm", "Cool", "Do we lean on warm, emotional tones or crisp, distant precision?")}
              {renderSlider("traditional", "Traditional ↔ Innovative", "Traditional", "Innovative", "Heritage-driven or future-focused?")}
              {renderSlider("luxury", "Luxury ↔ Budget-Friendly", "Luxury", "Budget-Friendly", "Premium experience or mass accessibility?")}
              {renderSlider("textFocused", "Text-Focused ↔ Image-Focused", "Text-Focused", "Image-Focused", "Words that lead or visuals that speak first?")}
              {renderSlider("corporate", "Corporate ↔ Artistic", "Corporate", "Artistic", "Structured and professional, or creative and free-flowing?")}
            </div>
          )}

          {/* Step 5: Inspiration */}
          {step === 5 && (
            <div className="space-y-6 animate-enter">
              <FormItem>
                <FormLabel>
                  <LabelWithTip
                    label="Upload inspiration images, brand examples, or moodboards."
                    tip="This gives me a peek into your mind. Pinterest links welcome too."
                  />
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={(e) => form.setValue("inspirationFiles", Array.from(e.target.files || []))}
                  />
                </FormControl>
                <FormDescription>Multiple files allowed.</FormDescription>
              </FormItem>

              <FormField
                control={form.control}
                name="brandColors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTip label="What colors should define your brand?" tip="Even one chosen color can tell me the mood you want to live in." />
                    </FormLabel>
                    <div className="flex flex-wrap items-center gap-4">
                      {(field.value || []).map((c, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={c}
                            onChange={(e) => {
                              const next = [...(field.value || [])];
                              next[idx] = e.target.value;
                              field.onChange(next);
                            }}
                            className="h-10 w-16 p-1"
                          />
                          <Input
                            value={c}
                            onChange={(e) => {
                              const next = [...(field.value || [])];
                              next[idx] = e.target.value;
                              field.onChange(next);
                            }}
                            className="w-28"
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => field.onChange([...(field.value || []), "#C5A572"])}
                      >
                        Add Color
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fontsLoved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LabelWithTip label="Any fonts you already love? (Optional)" tip="Fonts are voices. Let’s find the one that speaks your language." />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Playfair Display, Inter, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 6: Competition & Positioning */}
          {step === 6 && (
            <div className="space-y-6 animate-enter">
              <div className="grid gap-6 md:grid-cols-3">
                <FormField control={form.control} name="competitor1" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Top Competitor 1</FormLabel>
                    <FormControl><Input placeholder="Name or URL" {...field} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="competitor2" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Top Competitor 2</FormLabel>
                    <FormControl><Input placeholder="Name or URL" {...field} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="competitor3" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Top Competitor 3</FormLabel>
                    <FormControl><Input placeholder="Name or URL" {...field} /></FormControl>
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="compLike" render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you like about their branding?</FormLabel>
                  <FormControl><Textarea rows={3} placeholder="Strengths to learn from" {...field} /></FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="compDislike" render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you dislike about their branding?</FormLabel>
                  <FormControl><Textarea rows={3} placeholder="Gaps to exploit" {...field} /></FormControl>
                </FormItem>
              )} />
            </div>
          )}

          {/* Step 7: Vision & Goals */}
          {step === 7 && (
            <div className="space-y-6 animate-enter">
              <FormField control={form.control} name="vision1y" render={({ field }) => (
                <FormItem>
                  <FormLabel>Where do you see your brand in 1 year?</FormLabel>
                  <FormControl><Textarea rows={3} placeholder="Milestones in 12 months" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="vision5y" render={({ field }) => (
                <FormItem>
                  <FormLabel>Where do you see it in 5 years?</FormLabel>
                  <FormControl><Textarea rows={3} placeholder="Long-term trajectory" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="challenge" render={({ field }) => (
                <FormItem>
                  <FormLabel>What’s your biggest branding challenge right now?</FormLabel>
                  <FormControl><Textarea rows={3} placeholder="The obstacle in your way" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          )}

          {/* Step 8: Logistics & Budget */}
          {step === 8 && (
            <div className="space-y-6 animate-enter">
              <FormField control={form.control} name="launchTiming" render={({ field }) => (
                <FormItem>
                  <FormLabel>When do you want to launch/rebrand?</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full md:w-80"><SelectValue placeholder="Select timing" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {launchOptions.map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="budgetRange" render={({ field }) => (
                <FormItem>
                  <FormLabel>What’s your budget range?</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full md:w-80"><SelectValue placeholder="Select budget" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {budgetOptions.map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          )}

          {/* Step 9: Extra Insight */}
          {step === 9 && (
            <div className="space-y-6 animate-enter">
              <FormField control={form.control} name="extraNotes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Anything else I should know before we start building your empire? (Optional)</FormLabel>
                  <FormControl><Textarea rows={4} placeholder="Context, constraints, or wild ideas" {...field} /></FormControl>
                </FormItem>
              )} />
            </div>
          )}

          {/* Step 10: Final Screen */}
          {step === 10 && completed && (
            <div className="space-y-6 animate-enter">
              <div className="rounded-lg border bg-background p-6 text-center">
                <h3 className="font-display text-2xl">You’re not just filling a form — you’ve just started your Empire.</h3>
                <p className="mt-2 text-muted-foreground">
                  Your answers are the blueprint. My team and I will review everything, decode your brand’s DNA, and prepare recommendations tailored only for you.
                </p>
                <p className="mt-2 text-muted-foreground">Next steps: Book your strategy session below, and I’ll walk you through your personalized Brand Personality Snapshot.</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Button asChild variant="premium"><a href="#book" rel="noreferrer">Book My Strategy Call</a></Button>
                  <Button asChild variant="secondary"><a href="https://wa.me/2340000000000" target="_blank" rel="noreferrer">Call on WhatsApp</a></Button>
                  <Button asChild variant="outline"><a href="https://wa.me/2340000000000?text=Hi%20KING%2C%20I%20completed%20the%20onboarding" target="_blank" rel="noreferrer">Text on WhatsApp</a></Button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Download className="size-4" />
                  <span>Your “Brand Personality Snapshot” PDF was downloaded.</span>
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          {step < 10 && (
            <div className="flex items-center justify-between">
              <Button type="button" variant="outline" onClick={back} disabled={step === 1}>Back</Button>
              {step < 9 ? (
                <Button type="button" variant="premium" onClick={next}>Next</Button>
              ) : (
                <Button type="submit" variant="premium" disabled={loading}>
                  {loading ? "Saving..." : "Finish"}
                </Button>
              )}
            </div>
          )}
        </form>
      </Form>
      
    </div>
  );
}

