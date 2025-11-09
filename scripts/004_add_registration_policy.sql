-- Allow public registration (insert) into voters table
-- This policy allows anyone to register, but they can only view/update their own data after authentication

-- First, drop the policy if it already exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public voter registration" ON public.voters;

-- Create the INSERT policy to allow public registration
CREATE POLICY "Allow public voter registration" ON public.voters
  FOR INSERT
  WITH CHECK (true);

-- Verify the policy was created
-- You can check this in Supabase: Authentication > Policies > voters table
