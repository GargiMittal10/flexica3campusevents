-- Create feedback_sessions table
CREATE TABLE public.feedback_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  ended_at timestamp with time zone
);

-- Enable Row Level Security
ALTER TABLE public.feedback_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for feedback_sessions
CREATE POLICY "Anyone can view active feedback sessions"
  ON public.feedback_sessions
  FOR SELECT
  USING (true);

CREATE POLICY "Faculty can create feedback sessions"
  ON public.feedback_sessions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'faculty'
    )
  );

CREATE POLICY "Faculty can update their own sessions"
  ON public.feedback_sessions
  FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Faculty can delete their own sessions"
  ON public.feedback_sessions
  FOR DELETE
  USING (created_by = auth.uid());

-- Update feedback table RLS to require active session
DROP POLICY IF EXISTS "Students can submit feedback" ON public.feedback;

CREATE POLICY "Students can submit feedback"
  ON public.feedback
  FOR INSERT
  WITH CHECK (
    student_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'student'
    )
    AND EXISTS (
      SELECT 1 FROM public.attendance
      WHERE event_id = feedback.event_id AND student_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM public.feedback_sessions
      WHERE event_id = feedback.event_id AND is_active = true
    )
  );