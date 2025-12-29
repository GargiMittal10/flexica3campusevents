-- Drop the unique constraint on student_id since the same ID might be used by different users
-- (or users might retry with same ID after failed signup)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_student_id_key;