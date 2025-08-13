-- Fix the search path security warning by updating the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
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