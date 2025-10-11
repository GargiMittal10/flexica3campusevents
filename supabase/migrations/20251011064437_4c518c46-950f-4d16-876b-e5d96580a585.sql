-- Add status and ended_at columns to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'ended')),
ADD COLUMN IF NOT EXISTS ended_at timestamp with time zone;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);