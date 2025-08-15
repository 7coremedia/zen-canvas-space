export interface BrandPersonality {
  masculine: number;
  classic: number;
  playful: number;
  loud: number;
  approachable: number;
  warm: number;
  traditional: number;
  luxury: number;
  textFocused: number;
  corporate: number;
}

export interface Brand {
  id: string;
  user_id: string;
  brand_name: string;
  tagline: string;
  online_link: string;
  elevator_pitch: string;
  industry: string;
  offerings: string;
  usp: string;
  problem_solved: string;
  primary_audience: string;
  age_range: string;
  gender_focus: string;
  income_level: string;
  brand_personality: BrandPersonality;
  one_year_vision: string;
  five_year_vision: string;
  challenges: string;
  competitors: string;
  likes_dislikes: string;
  launch_timing: string;
  budget_range: string;
  extra_notes: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export const defaultBrandPersonality: BrandPersonality = {
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
};

export const defaultBrand: Omit<Brand, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'is_primary'> = {
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
  brand_personality: { ...defaultBrandPersonality },
  one_year_vision: '',
  five_year_vision: '',
  challenges: '',
  competitors: '',
  likes_dislikes: '',
  launch_timing: '',
  budget_range: '',
  extra_notes: '',
};
