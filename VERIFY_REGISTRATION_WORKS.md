# Verify Registration is Working

## ✅ RLS Policies Fixed

Great! You've run the SQL script. Now let's test if registration works.

## Test Registration Now

1. **Refresh Your Browser:**
   - Go to: http://localhost:3000/register
   - Or refresh the page if it's already open
   - Press `Ctrl + F5` for a hard refresh

2. **Fill in the Registration Form:**
   - **Voter ID**: Enter a unique ID (e.g., "VOTER001" or "TEST123")
   - **Aadhaar Number**: Enter 12 digits (e.g., "123456789012")
   - **Full Name**: Enter your name
   - **Email**: Enter a valid email (e.g., "test@example.com")
   - **Date of Birth**: Select a date
   - **Phone Number**: (Optional)
   - **Address**: Enter your address
   - **Face Photo**: Upload a clear face photo

3. **Click "Register to Vote"**

4. **Expected Result:**
   - ✅ **NO ERROR MESSAGE**
   - ✅ Should show "Registration Successful!" message
   - ✅ Should redirect to success page after 2 seconds
   - ✅ No red error box

## Verify Data is Saved

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/wodvyqehkduwieqtrcry

2. **Open Table Editor:**
   - Click **Table Editor** in left sidebar
   - Click on **voters** table

3. **Check Your Data:**
   - You should see your registration record
   - All fields should be filled:
     - `voter_id` - Your Voter ID
     - `aadhaar_number` - Your Aadhaar number
     - `full_name` - Your name
     - `email` - Your email
     - `date_of_birth` - Your date of birth
     - `address` - Your address
     - `face_encoding` - Should have encoded data (not null)
     - `is_verified` - Should be `false`
     - `is_active` - Should be `true`

## Test Login

After successful registration:

1. **Go to Login Page:**
   - http://localhost:3000/auth/login

2. **Enter Your Credentials:**
   - **Voter ID**: The one you just registered
   - **Aadhaar Number**: The one you just registered

3. **Complete Face Verification:**
   - Click "Proceed to Face Verification"
   - Allow camera access when prompted
   - Look directly at the camera
   - Click "Capture & Verify Face"
   - Wait for verification (should take a few seconds)

4. **Expected Result:**
   - ✅ Face verification should succeed
   - ✅ Should show "Identity Verified!"
   - ✅ Should redirect to dashboard
   - ✅ You should be logged in

## Success Checklist

- [ ] Registration form submits without errors
- [ ] Success message appears
- [ ] Data appears in Supabase `voters` table
- [ ] Can login with registered credentials
- [ ] Face verification works during login
- [ ] Redirects to dashboard after login

## If It Still Doesn't Work

If you still see errors:

1. **Check Browser Console:**
   - Press `F12` to open developer tools
   - Click on "Console" tab
   - Look for any red error messages
   - Share the error if you see one

2. **Check Server Logs:**
   - Look at your terminal where `npm run dev` is running
   - Check for any error messages
   - Share any errors you see

3. **Verify Policies:**
   - Go to Supabase → Authentication → Policies
   - Check that `voters` table has 3 policies:
     - "Allow public voter registration" (INSERT)
     - "Voters can view their own data" (SELECT)
     - "Voters can update their own data" (UPDATE)

## Next Steps After Registration Works

Once registration and login work:

1. **Create Sample Elections:**
   - Run `scripts/002_seed_sample_data.sql` to add sample elections

2. **Test Voting:**
   - Try casting a vote in an election

3. **Admin Features:**
   - Create admin panel to verify voters
   - Set `is_verified = true` for approved voters

