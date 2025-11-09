# Test Registration - Step by Step

## ✅ RLS Policy Added

Great! You've added the RLS policy. Now let's test if registration works.

## Test Registration

1. **Go to Registration Page:**
   - Open: http://localhost:3000/register
   - Or refresh the page if it's already open

2. **Fill in the Registration Form:**
   - **Voter ID**: Enter a unique ID (e.g., "VOTER001")
   - **Aadhaar Number**: Enter 12 digits (e.g., "123456789012")
   - **Full Name**: Enter your name
   - **Email**: Enter a valid email (e.g., "test@example.com")
   - **Date of Birth**: Select a date
   - **Phone Number**: (Optional)
   - **Address**: Enter your address
   - **Face Photo**: Upload a clear face photo

3. **Click "Register to Vote"**

4. **Expected Result:**
   - ✅ Should show "Registration Successful!" message
   - ✅ Should redirect to success page
   - ✅ No error messages

## Verify in Supabase

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/wodvyqehkduwieqtrcry

2. **Open Table Editor:**
   - Click **Table Editor** in left sidebar
   - Click on **voters** table

3. **Check for Your Data:**
   - You should see your registration record
   - Check that all fields are filled:
     - `voter_id`
     - `aadhaar_number`
     - `full_name`
     - `email`
     - `date_of_birth`
     - `address`
     - `face_encoding` (should have data)
     - `is_verified` (should be `false`)
     - `is_active` (should be `true`)

## Test Login

After successful registration:

1. **Go to Login Page:**
   - http://localhost:3000/auth/login

2. **Enter Credentials:**
   - **Voter ID**: The one you registered with
   - **Aadhaar Number**: The one you registered with

3. **Complete Face Verification:**
   - Allow camera access
   - Look at the camera
   - Click "Capture & Verify Face"

4. **Expected Result:**
   - ✅ Face verification should succeed
   - ✅ Should redirect to dashboard
   - ✅ Should be logged in

## Troubleshooting

### If Registration Still Fails:

1. **Check Browser Console:**
   - Press F12
   - Look for any red error messages
   - Share the error if you see one

2. **Check Server Logs:**
   - Look at your terminal where `npm run dev` is running
   - Check for any error messages

3. **Verify RLS Policy:**
   - Go to Supabase → Authentication → Policies
   - Check that "Allow public voter registration" policy exists for `voters` table

### Common Issues:

- **"Voter ID already exists"**: Try a different Voter ID
- **"Aadhaar number already exists"**: Try a different Aadhaar number
- **"Invalid email format"**: Make sure email has @ symbol
- **"Aadhaar number must be 12 digits"**: Enter exactly 12 digits

## Success Checklist

- [ ] Registration form submits without errors
- [ ] Success message appears
- [ ] Data appears in Supabase `voters` table
- [ ] Can login with registered credentials
- [ ] Face verification works during login
- [ ] Redirects to dashboard after login

## Next Steps After Registration Works

1. **Admin Verification:**
   - Create admin panel to verify voters
   - Set `is_verified = true` for approved voters

2. **Email Verification:**
   - Add email verification workflow
   - Send confirmation emails

3. **Security Enhancements:**
   - Add CAPTCHA to prevent spam
   - Rate limiting on registration
   - Password hashing improvements

