-- Complete fix for RLS policies on voters table
-- This script will fix all RLS issues for registration

-- Step 1: Drop all existing policies on voters table (we'll recreate them)
DROP POLICY IF EXISTS "Voters can view their own data" ON public.voters;
DROP POLICY IF EXISTS "Voters can update their own data" ON public.voters;
DROP POLICY IF EXISTS "Allow public voter registration" ON public.voters;
DROP POLICY IF EXISTS "Public can insert voters" ON public.voters;

-- Step 2: Recreate all policies correctly

-- Policy 1: Allow public registration (INSERT) - This is the critical one for registration
CREATE POLICY "Allow public voter registration" ON public.voters
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy 2: Allow voters to view their own data (SELECT)
-- Note: This uses email matching since auth.uid() won't work for unauthenticated users
CREATE POLICY "Voters can view their own data" ON public.voters
  FOR SELECT
  USING (
    -- Allow if authenticated and matches user ID
    (auth.uid()::text = id::text)
    OR
    -- Allow if email matches (for login verification)
    (auth.jwt() ->> 'email' = email)
  );

-- Policy 3: Allow voters to update their own data (UPDATE)
CREATE POLICY "Voters can update their own data" ON public.voters
  FOR UPDATE
  USING (
    (auth.uid()::text = id::text)
    OR
    (auth.jwt() ->> 'email' = email)
  );

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'voters'
ORDER BY policyname;

