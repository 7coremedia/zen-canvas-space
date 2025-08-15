import { z } from 'zod';
import { defaultBrandPersonality } from '@/types/brand';

export const brandPersonalitySchema = z.object({
  masculine: z.number().min(1).max(10).default(defaultBrandPersonality.masculine),
  classic: z.number().min(1).max(10).default(defaultBrandPersonality.classic),
  playful: z.number().min(1).max(10).default(defaultBrandPersonality.playful),
  loud: z.number().min(1).max(10).default(defaultBrandPersonality.loud),
  approachable: z.number().min(1).max(10).default(defaultBrandPersonality.approachable),
  warm: z.number().min(1).max(10).default(defaultBrandPersonality.warm),
  traditional: z.number().min(1).max(10).default(defaultBrandPersonality.traditional),
  luxury: z.number().min(1).max(10).default(defaultBrandPersonality.luxury),
  textFocused: z.number().min(1).max(10).default(defaultBrandPersonality.textFocused),
  corporate: z.number().min(1).max(10).default(defaultBrandPersonality.corporate),
});

export const brandFormSchema = z.object({
  brand_name: z.string().min(2, { message: 'Brand name must be at least 2 characters' }),
  tagline: z.string().optional(),
  online_link: z.string().url('Must be a valid URL').or(z.literal('')),
  elevator_pitch: z.string().min(10, { message: 'Please provide a more detailed pitch' }).max(500),
  industry: z.string().min(1, { message: 'Please select an industry' }),
  offerings: z.string().min(10, { message: 'Please describe your offerings in more detail' }),
  usp: z.string().min(10, { message: 'Please provide a more detailed unique selling proposition' }),
  problem_solved: z.string().min(10, { message: 'Please describe the problem you solve' }),
  primary_audience: z.string().min(1, { message: 'Please describe your primary audience' }),
  age_range: z.string().min(1, { message: 'Please specify an age range' }),
  gender_focus: z.string().optional(),
  income_level: z.string().optional(),
  brand_personality: brandPersonalitySchema,
  one_year_vision: z.string().min(10, { message: 'Please provide a more detailed one-year vision' }),
  five_year_vision: z.string().min(10, { message: 'Please provide a more detailed five-year vision' }),
  challenges: z.string().optional(),
  competitors: z.string().optional(),
  likes_dislikes: z.string().optional(),
  launch_timing: z.string().optional(),
  budget_range: z.string().optional(),
  extra_notes: z.string().optional(),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;
