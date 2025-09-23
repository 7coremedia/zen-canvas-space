-- Create roles table for user role management
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  is_moderator BOOLEAN DEFAULT FALSE,
  is_worker BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create role_requests table for pending role requests
CREATE TABLE IF NOT EXISTS public.role_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  requested_role TEXT NOT NULL CHECK (requested_role IN ('admin', 'moderator', 'worker')),
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT
);

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roles table
CREATE POLICY "Users can view their own role" 
ON public.roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.roles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.roles 
    WHERE user_id = auth.uid() 
    AND is_admin = true 
    AND is_approved = true
  )
);

CREATE POLICY "Admins can update all roles" 
ON public.roles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.roles 
    WHERE user_id = auth.uid() 
    AND is_admin = true 
    AND is_approved = true
  )
);

-- RLS Policies for role_requests table
CREATE POLICY "Users can view their own role requests" 
ON public.role_requests FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all role requests" 
ON public.role_requests FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.roles 
    WHERE user_id = auth.uid() 
    AND is_admin = true 
    AND is_approved = true
  )
);

CREATE POLICY "Users can insert their own role requests" 
ON public.role_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update role requests" 
ON public.role_requests FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.roles 
    WHERE user_id = auth.uid() 
    AND is_admin = true 
    AND is_approved = true
  )
);

-- Function to approve role request
CREATE OR REPLACE FUNCTION approve_role_request(
  request_id UUID,
  approver_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  request_record RECORD;
BEGIN
  -- Get the role request
  SELECT * INTO request_record 
  FROM public.role_requests 
  WHERE id = request_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Update the role request status
  UPDATE public.role_requests 
  SET status = 'approved', 
      reviewed_at = now(), 
      reviewed_by = approver_id
  WHERE id = request_id;
  
  -- Create or update the user's role
  INSERT INTO public.roles (user_id, email, is_admin, is_moderator, is_worker, is_approved, approved_by)
  VALUES (
    request_record.user_id,
    request_record.email,
    request_record.requested_role = 'admin',
    request_record.requested_role = 'moderator',
    request_record.requested_role = 'worker',
    true,
    approver_id
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    is_admin = CASE WHEN request_record.requested_role = 'admin' THEN true ELSE roles.is_admin END,
    is_moderator = CASE WHEN request_record.requested_role = 'moderator' THEN true ELSE roles.is_moderator END,
    is_worker = CASE WHEN request_record.requested_role = 'worker' THEN true ELSE roles.is_worker END,
    is_approved = true,
    approved_by = approver_id,
    approved_at = now(),
    updated_at = now();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject role request
CREATE OR REPLACE FUNCTION reject_role_request(
  request_id UUID,
  approver_id UUID,
  review_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.role_requests 
  SET status = 'rejected', 
      reviewed_at = now(), 
      reviewed_by = approver_id,
      review_notes = COALESCE(review_notes, 'No reason provided')
  WHERE id = request_id AND status = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert your email as admin (replace with your actual user ID from auth.users)
-- First, let's create a function to add admin by email
CREATE OR REPLACE FUNCTION add_admin_by_email(admin_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find the user by email
  SELECT * INTO user_record 
  FROM auth.users 
  WHERE email = admin_email;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Insert admin role
  INSERT INTO public.roles (user_id, email, is_admin, is_approved, approved_at)
  VALUES (user_record.id, admin_email, true, true, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET
    is_admin = true,
    is_approved = true,
    approved_at = now(),
    updated_at = now();
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Call the function to add your email as admin
SELECT add_admin_by_email('thedrawingboard.news@gmail.com');
