# Fix RLS Policy Error - Quick Fix

## Error Message
```
Registration failed: new row violates row-level security policy for table "voters"
```

## Solution: Add INSERT Policy

You need to add a Row Level Security (RLS) policy to allow registration.

### Quick Steps:

1. **Go to Supabase Dashboard:**
   - Open: https://supabase.com/dashboard/project/wodvyqehkduwieqtrcry

2. **Open SQL Editor:**
   - Click **SQL Editor** in the left sidebar
   - Click **New query** (the + button)

3. **Copy and Paste this SQL:**
   ```sql
   -- Allow public registration (insert) into voters table
   DROP POLICY IF EXISTS "Allow public voter registration" ON public.voters;
   
   CREATE POLICY "Allow public voter registration" ON public.voters
     FOR INSERT
     WITH CHECK (true);
   ```

4. **Run the SQL:**
   - Click **Run** button (or press Ctrl+Enter)
   - You should see "Success. No rows returned"

5. **Verify:**
   - Go to **Authentication** > **Policies** in Supabase
   - Find the `voters` table
   - You should see 3 policies:
     - "Voters can view their own data" (SELECT)
     - "Voters can update their own data" (UPDATE)
     - "Allow public voter registration" (INSERT) ← This is the new one

### Alternative: Run the Script File

The SQL is also saved in: `scripts/004_add_registration_policy.sql`

## After Adding the Policy

1. **Refresh your browser** (the registration page)
2. **Try registering again** with the same data
3. **Check Supabase Table Editor** → `voters` table
4. **You should see your registration data!**

## What This Policy Does

- ✅ Allows anyone to INSERT (register) new voters
- ✅ Still protects data: users can only SELECT/UPDATE their own records after authentication
- ✅ Maintains security while allowing public registration

## Troubleshooting

If you still get errors after adding the policy:

1. **Check if policy exists:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'voters';
   ```

2. **Verify RLS is enabled:**
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'voters';
   ```
   (Should show `rowsecurity = true`)

3. **Check for conflicting policies:**
   - Go to **Authentication** > **Policies** > `voters` table
   - Make sure there are no conflicting INSERT policies

