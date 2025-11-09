# Fix "Unexpected token '<', "<!DOCTYPE "..." Error

## What This Error Means

This error occurs when the API returns HTML (like an error page) instead of JSON. The browser tries to parse HTML as JSON and fails.

## Common Causes

1. **API Route Not Found (404)**
   - The route file doesn't exist or has wrong path
   - Next.js returns HTML 404 page

2. **Server Error (500)**
   - Runtime error in the API route
   - Next.js returns HTML error page

3. **Build/Compilation Error**
   - TypeScript/JavaScript error in the route
   - Server can't compile the route

## Solutions

### Step 1: Check Server Logs

Look at your terminal where `npm run dev` is running:

```bash
# You should see something like:
✓ Ready in 2.3s
○ Compiling /api/register ...
```

**If you see errors:**
- Share the error message
- Check for TypeScript errors
- Check for missing imports

### Step 2: Verify API Route Exists

Check that the file exists:
- `app/api/register/route.ts` ✅ Should exist
- `app/api/face/verify/route.ts` ✅ Should exist

### Step 3: Restart Development Server

Sometimes the server needs a restart:

1. **Stop the server:**
   - Press `Ctrl + C` in the terminal

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   # Or on Windows PowerShell:
   Remove-Item -Recurse -Force .next
   ```

3. **Restart server:**
   ```bash
   npm run dev
   ```

### Step 4: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for the error message
4. Check **Network** tab:
   - Find the `/api/register` request
   - Check the **Response** tab
   - See if it's HTML or JSON

### Step 5: Test API Directly

You can test the API route directly:

```bash
# Test registration API
curl -X POST http://localhost:3000/api/register \
  -F "voterID=TEST123" \
  -F "aadhaarNumber=123456789012" \
  -F "fullName=Test User" \
  -F "email=test@example.com" \
  -F "dateOfBirth=2000-01-01" \
  -F "address=Test Address" \
  -F "faceImage=@path/to/image.jpg"
```

## What I Fixed

I've added error handling to:

1. **Registration Page** (`app/register/page.tsx`)
   - Checks if response is JSON before parsing
   - Shows better error messages

2. **Login Page** (`app/auth/login/page.tsx`)
   - Same JSON validation
   - Better error handling

3. **Registration API** (`app/api/register/route.ts`)
   - Better FormData parsing error handling

## Next Steps

1. **Restart your dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Try registration again**

3. **Check browser console (F12)** for any new error messages

4. **Check server terminal** for any errors

## If Error Persists

Share:
1. The exact error message from browser console
2. Any errors from server terminal
3. The Network tab response (from browser DevTools)

This will help identify the exact issue.

