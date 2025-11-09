# Fix Registration and Login Issue

## Problem
- Registration shows "successfully registered" but data isn't saved to database
- Login shows "invalid credentials" because no data exists in database

## Solution Implemented

### 1. ✅ Created Registration API Route
- Created `app/api/register/route.ts` to handle voter registration
- Processes face image and extracts face encoding
- Saves voter data to Supabase database

### 2. ✅ Updated Registration Page
- Updated `app/register/page.tsx` to call the API
- Added proper validation (email, Aadhaar number format)
- Made email, date of birth, and address required fields

### 3. ✅ Fixed Face Verification API
- Updated `app/api/face/verify/route.ts` to handle FormData from login
- Removed invalid vote_verification insert during login

## ⚠️ REQUIRED: Update Database RLS Policy

**You MUST run this SQL in your Supabase SQL Editor to allow registration:**

```sql
-- Allow public registration (insert) into voters table
CREATE POLICY "Allow public voter registration" ON public.voters
  FOR INSERT
  WITH CHECK (true);
```

### Steps to Add RLS Policy:

1. Go to your Supabase dashboard
2. Click on **SQL Editor**
3. Click **New query**
4. Paste the SQL above
5. Click **Run**
6. Verify the policy was created (you should see "Success")

**OR** run the script: `scripts/004_add_registration_policy.sql`

## Testing

After adding the RLS policy:

1. **Test Registration:**
   - Go to http://localhost:3000/register
   - Fill in all required fields:
     - Voter ID
     - Aadhaar Number (12 digits)
     - Full Name
     - Email (required)
     - Date of Birth (required)
     - Address (required)
     - Upload face photo
   - Click "Register to Vote"
   - Check Supabase Table Editor → `voters` table
   - You should see the new voter record

2. **Test Login:**
   - Go to http://localhost:3000/auth/login
   - Enter the Voter ID and Aadhaar number you registered with
   - Complete face verification
   - You should be logged in successfully

## Files Changed

1. ✅ `app/api/register/route.ts` - New registration API
2. ✅ `app/register/page.tsx` - Updated to save data
3. ✅ `app/api/face/verify/route.ts` - Fixed to handle FormData
4. ✅ `app/auth/login/page.tsx` - Fixed similarity check
5. ✅ `scripts/004_add_registration_policy.sql` - RLS policy script

## Important Notes

- **Email is now required** for registration (needed for login authentication)
- **Date of Birth is required** (matches database schema)
- **Address is required** (matches database schema)
- Face encoding is automatically processed and stored
- Voters are set to `is_verified: false` by default (requires admin approval)

## Troubleshooting

### If registration still doesn't save:
1. Check browser console for errors
2. Check terminal/server logs for API errors
3. Verify RLS policy was created in Supabase
4. Check Supabase Table Editor to see if any data was inserted

### If login fails:
1. Verify voter exists in `voters` table in Supabase
2. Check that `face_encoding` field is not null
3. Verify email was provided during registration
4. Check browser console for errors

## Next Steps

After registration works:
1. Create admin panel to verify voters (`is_verified: true`)
2. Set up email verification
3. Add CAPTCHA to prevent spam registrations
4. Implement proper password hashing for authentication

