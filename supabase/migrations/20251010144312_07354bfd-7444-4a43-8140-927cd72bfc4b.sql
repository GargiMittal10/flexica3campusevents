-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'faculty', 'student');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create pending faculty approvals table
CREATE TABLE public.pending_faculty_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  student_id TEXT NOT NULL,
  id_card_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.pending_faculty_approvals ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for pending_faculty_approvals
CREATE POLICY "Admins can view all pending approvals"
ON public.pending_faculty_approvals FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pending approvals"
ON public.pending_faculty_approvals FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert faculty approval requests"
ON public.pending_faculty_approvals FOR INSERT
WITH CHECK (true);

-- Create storage bucket for ID cards
INSERT INTO storage.buckets (id, name, public) 
VALUES ('faculty-id-cards', 'faculty-id-cards', false);

-- Storage policies for ID cards
CREATE POLICY "Admins can view ID cards"
ON storage.objects FOR SELECT
USING (bucket_id = 'faculty-id-cards' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can upload ID cards"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'faculty-id-cards');

-- Function to handle approved faculty signup
CREATE OR REPLACE FUNCTION public.approve_faculty_signup(approval_id UUID, admin_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_approval RECORD;
  v_new_user_id UUID;
BEGIN
  -- Get the approval record
  SELECT * INTO v_approval
  FROM pending_faculty_approvals
  WHERE id = approval_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Approval request not found or already processed';
  END IF;
  
  -- Update approval status
  UPDATE pending_faculty_approvals
  SET status = 'approved',
      reviewed_at = now(),
      reviewed_by = admin_id
  WHERE id = approval_id;
END;
$$;