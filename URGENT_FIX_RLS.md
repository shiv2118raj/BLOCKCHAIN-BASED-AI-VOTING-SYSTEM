# URGENT: Fix RLS Policy Error

## The Problem
Even after adding the policy, you're still getting:
```
Registration failed: new row violates row-level security policy for table "voters"
```

## The Solution

The policy needs to explicitly allow the `anon` role (anonymous users). Run this SQL:

### Step 1: Go to Supabase SQL Editor
1. Open: https://supabase.com/dashboard/project/wodvyqehkduwieqtrcry/sql/new
2. Or: SQL Editor → New query

### Step 2: Run This Complete SQL Script

```sql
-- Remove all existing policies on voters table
DROP POLICY IF EXISTS "Voters can view their own data" ON public.voters;
DROP POLICY IF EXISTS "Voters can update their own data" ON public.voters;
DROP POLICY IF EXISTS "Allow public voter registration" ON public.voters;

-- Create INSERT policy that explicitly allows anon role
CREATE POLICY "Allow public voter registration" ON public.voters
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Recreate SELECT policy (for viewing own data)
CREATE POLICY "Voters can view their own data" ON public.voters
  FOR SELECT
  USING (
    (auth.uid()::text = id::text)
    OR
    (auth.jwt() ->> 'email' = email)
  );

-- Recreate UPDATE policy (for updating own data)
CREATE POLICY "Voters can update their own data" ON public.voters
  FOR UPDATE
  USING (
    (auth.uid()::text = id::text)
    OR
    (auth.jwt() ->> 'email' = email)
  );
```

### Step 3: Verify It Worked

After running, you should see "Success" messages. Then verify:

```sql
-- Check all policies on voters table
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'voters';
```

You should see:
- "Allow public voter registration" with `cmd = INSERT` and `roles = {anon,authenticated}`

### Step 4: Test Registration Again

1. Refresh your browser
2. Try registering again
3. The error should be gone!

## Alternative: Temporarily Disable RLS (NOT RECOMMENDED for production)

If the above doesn't work, you can temporarily disable RLS to test:

```sql
-- ONLY FOR TESTING - Disable RLS on voters table
ALTER TABLE public.voters DISABLE ROW LEVEL SECURITY;
```

**⚠️ WARNING:** This removes all security. Only use for testing, then re-enable:

```sql
-- Re-enable RLS
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
```

## Why This Happens

The Supabase client uses the `anon` role by default. The RLS policy must explicitly allow this role to INSERT. The key is adding `TO anon, authenticated` to the policy.

