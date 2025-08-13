-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create onboarding_responses table
CREATE TABLE public.onboarding_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT, -- For anonymous users before they sign up
  brand_name TEXT,
  tagline TEXT,
  online_link TEXT,
  elevator_pitch TEXT,
  industry TEXT,
  offerings TEXT,
  usp TEXT,
  problem_solved TEXT,
  primary_audience TEXT,
  age_range TEXT,
  gender_focus TEXT,
  income_level TEXT,
  brand_personality JSONB, -- Store slider values as JSON
  inspiration_files TEXT[], -- Array of file URLs
  brand_colors TEXT[],
  fonts TEXT[],
  competitors TEXT,
  likes_dislikes TEXT,
  one_year_vision TEXT,
  five_year_vision TEXT,
  challenges TEXT,
  launch_timing TEXT,
  budget_range TEXT,
  extra_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for onboarding_responses
CREATE POLICY "Users can view their own responses" 
ON public.onboarding_responses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses" 
ON public.onboarding_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own responses" 
ON public.onboarding_responses 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow anonymous users to insert responses (before authentication)
CREATE POLICY "Anonymous users can insert responses" 
ON public.onboarding_responses 
FOR INSERT 
WITH CHECK (user_id IS NULL);

-- Create storage bucket for inspiration files
INSERT INTO storage.buckets (id, name, public) VALUES ('inspiration', 'inspiration', false);

-- Create policies for inspiration uploads
CREATE POLICY "Users can view their own inspiration files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'inspiration' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own inspiration files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'inspiration' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_responses_updated_at
  BEFORE UPDATE ON public.onboarding_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Link any existing onboarding responses to this user
  UPDATE public.onboarding_responses 
  SET user_id = NEW.id 
  WHERE session_id = NEW.id::text AND user_id IS NULL;
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();