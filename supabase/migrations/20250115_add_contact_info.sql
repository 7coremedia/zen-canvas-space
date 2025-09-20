-- Add contact information fields to onboarding_responses table
ALTER TABLE public.onboarding_responses 
ADD COLUMN sender_name TEXT,
ADD COLUMN sender_email TEXT;

-- Add comments for clarity
COMMENT ON COLUMN public.onboarding_responses.sender_name IS 'Full name of the person submitting the onboarding form';
COMMENT ON COLUMN public.onboarding_responses.sender_email IS 'Email address of the person submitting the onboarding form';
