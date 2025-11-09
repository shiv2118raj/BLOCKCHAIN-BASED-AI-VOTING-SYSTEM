# Webcam Registration - Complete Guide

## ✅ Changes Made

The registration page has been updated to use **webcam capture** instead of file upload.

### What Changed:

1. **Removed File Upload**
   - No more "Choose File" button
   - No file picker

2. **Added Webcam Capture**
   - "Open Camera" button to start webcam
   - Live video preview with face detection frame
   - "Capture Photo" button to take the picture
   - "Retake" option if you want to capture again

3. **Improved User Experience**
   - Real-time camera preview
   - Clear instructions for positioning face
   - Visual feedback when face is captured
   - Camera automatically stops after capture

## How to Use

### Step 1: Fill in Registration Form
- Enter all required fields:
  - Voter ID
  - Aadhaar Number (12 digits)
  - Full Name
  - Email
  - Date of Birth
  - Address
  - Phone Number (optional)

### Step 2: Capture Your Face
1. Click **"Open Camera"** button
2. **Allow camera access** when browser prompts
3. **Position your face** within the frame
   - Ensure good lighting
   - Look directly at the camera
   - Keep face centered
4. Click **"Capture Photo"** when ready
5. Camera will stop automatically
6. You'll see "Face captured successfully!" message
7. Click **"Retake"** if you want to capture again

### Step 3: Submit Registration
1. Click **"Register to Vote"** button
2. Wait for processing (face encoding, database save)
3. You'll see "Registration Successful!" message
4. Redirects to success page

## What Gets Stored in Database

All data is saved to Supabase `voters` table:

- ✅ `voter_id` - Your Voter ID
- ✅ `aadhaar_number` - Your Aadhaar number
- ✅ `full_name` - Your full name
- ✅ `email` - Your email address
- ✅ `date_of_birth` - Your date of birth
- ✅ `address` - Your address
- ✅ `phone_number` - Your phone (if provided)
- ✅ `face_encoding` - Encoded face features (for verification)
- ✅ `is_verified` - Set to `false` (requires admin approval)
- ✅ `is_active` - Set to `true`
- ✅ `created_at` - Timestamp of registration

## Camera Requirements

- **Browser Support:**
  - Chrome/Edge: ✅ Full support
  - Firefox: ✅ Full support
  - Safari: ✅ Full support
  - Mobile browsers: ✅ Supported

- **Permissions:**
  - Browser will ask for camera permission
  - Click "Allow" to proceed
  - Permission is only for this session

- **Camera Settings:**
  - Uses front-facing camera (selfie camera)
  - Resolution: 640x480 (ideal)
  - Automatically adjusts to available camera

## Troubleshooting

### Camera Not Starting
- **Check browser permissions:**
  - Go to browser settings
  - Allow camera access for this site
  - Refresh the page

- **Check if camera is in use:**
  - Close other apps using camera
  - Try refreshing the page

### Face Not Capturing
- **Check lighting:**
  - Ensure good lighting
  - Avoid backlighting
  - Face should be clearly visible

- **Check positioning:**
  - Keep face centered in frame
  - Look directly at camera
  - Remove glasses if possible (for better recognition)

### Registration Fails After Capture
- **Check browser console (F12):**
  - Look for error messages
  - Share error if you see one

- **Verify database connection:**
  - Check Supabase dashboard
  - Ensure RLS policies are set correctly

## Security Features

1. **Face Encoding:**
   - Face image is processed and encoded
   - Only face features are stored (not the actual image)
   - Encoded data is used for verification

2. **Data Validation:**
   - Email format validation
   - Aadhaar number validation (12 digits)
   - Required fields validation

3. **Database Security:**
   - RLS policies protect data
   - Only authorized users can view/update their data
   - Public registration allowed (with proper policies)

## Testing Checklist

- [ ] Camera opens when clicking "Open Camera"
- [ ] Video preview shows face clearly
- [ ] "Capture Photo" button works
- [ ] Camera stops after capture
- [ ] "Face captured successfully!" message appears
- [ ] "Retake" button allows recapture
- [ ] Registration form submits successfully
- [ ] Data appears in Supabase `voters` table
- [ ] Face encoding is stored correctly

## Next Steps

After successful registration:

1. **Admin Verification:**
   - Admin needs to verify the voter
   - Set `is_verified = true` in database

2. **Login:**
   - Use registered Voter ID and Aadhaar number
   - Complete face verification
   - Access dashboard

3. **Voting:**
   - Once verified, you can participate in elections
   - Face verification required for each vote

