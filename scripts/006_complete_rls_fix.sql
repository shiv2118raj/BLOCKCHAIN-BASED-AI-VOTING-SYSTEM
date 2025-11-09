-- Complete RLS Fix for Voters Table
-- This script removes old policies and creates new ones correctly
-- Just run this entire script - it handles everything!

-- Step 1: Remove all existing policies (safe to run even if they don't exist)
DROP POLICY IF EXISTS "Voters can view their own data" ON public.voters;
DROP POLICY IF EXISTS "Voters can update their own data" ON public.voters;
DROP POLICY IF EXISTS "Allow public voter registration" ON public.voters;

-- Step 2: Create the INSERT policy (allows registration)
-- The key is "TO anon, authenticated" - this allows anonymous users to register
CREATE POLICY "Allow public voter registration" ON public.voters
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Step 3: Create the SELECT policy (allows viewing own data)
CREATE POLICY "Voters can view their own data" ON public.voters
  FOR SELECT
  USING (
    (auth.uid()::text = id::text)
    OR
    (auth.jwt() ->> 'email' = email)
  );

-- Step 4: Create the UPDATE policy (allows updating own data)
CREATE POLICY "Voters can update their own data" ON public.voters
  FOR UPDATE
  USING (
    (auth.uid()::text = id::text)
    OR
    (auth.jwt() ->> 'email' = email)
  );

-- Done! The script handles everything automatically.

