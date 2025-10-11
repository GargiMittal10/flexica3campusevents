-- Create attendance_sessions table to track when faculty starts attendance marking
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;

-- Faculty can create attendance sessions
CREATE POLICY "Faculty can create attendance sessions"
ON public.attendance_sessions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'faculty'
  )
);

-- Faculty can update their own attendance sessions
CREATE POLICY "Faculty can update their own sessions"
ON public.attendance_sessions
FOR UPDATE
USING (created_by = auth.uid());

-- Everyone can view active attendance sessions
CREATE POLICY "Anyone can view active sessions"
ON public.attendance_sessions
FOR SELECT
USING (true);

-- Faculty can delete their own sessions
CREATE POLICY "Faculty can delete their own sessions"
ON public.attendance_sessions
FOR DELETE
USING (created_by = auth.uid());

-- Create index for better performance
CREATE INDEX idx_attendance_sessions_active ON public.attendance_sessions(is_active, event_id) WHERE is_active = true;