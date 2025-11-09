# Debug Face Verification Issues

## Current Status

Based on the console logs, I can see:
- ✅ Models loaded successfully
- ✅ Voter verification started
- ❓ Face detection may not be working

## Changes Made:

1. **Lowered Auto-Verify Threshold**: 70% → 50%
2. **Reduced Stable Frames**: 5 → 3 (faster verification)
3. **Added Better Logging**: Console will show detection progress
4. **Manual Verify Always Available**: Button works even if face not detected
5. **Better Error Handling**: More informative error messages

## How to Debug:

### Step 1: Check Browser Console

Open DevTools (F12) and look for these messages:

**Expected logs:**
```
[v0] Loading face recognition models from /models...
[v0] Face recognition models loaded successfully
[v0] Starting real-time face detection...
[v0] Face detected: XX% (stable: X/3)
[v0] Stable face detected, starting auto-verification...
```

**If you see:**
- `[v0] Using fallback detection` → face-api.js not working, use manual verify
- `[v0] Face detection error:` → Check the error message
- No detection logs → Detection not running

### Step 2: Try Manual Verification

1. **Click "Manual Verify" button** (even if face not detected)
2. This should trigger verification immediately
3. Check console for: `[v0] Manual face capture triggered`

### Step 3: Check Network Tab

1. Open DevTools → Network tab
2. Try verification
3. Look for `/api/face/verify` request
4. Check:
   - Status code (should be 200)
   - Response (should be JSON with similarity score)

## Common Issues:

### Issue 1: Face Not Detecting
**Symptoms:**
- Status shows "Position your face in the frame"
- No detection box appears
- Console shows no detection logs

**Solutions:**
- Check lighting (needs good lighting)
- Move closer to camera
- Remove glasses if possible
- Click "Manual Verify" to bypass detection

### Issue 2: Detection But No Auto-Verify
**Symptoms:**
- Face detected (green/yellow box)
- Confidence shown
- But verification doesn't start

**Solutions:**
- Wait a bit longer (needs 3 stable frames = ~1 second)
- Click "Manual Verify" button
- Check console for detection logs

### Issue 3: Verification Fails
**Symptoms:**
- Verification starts
- But fails with similarity error

**Solutions:**
- Similarity threshold is 50% (already low)
- Try better lighting
- Look directly at camera
- Make sure face is clearly visible

## Quick Fix: Use Manual Verify

If auto-verification isn't working:
1. **Click "Manual Verify" button**
2. This will capture and verify immediately
3. No need to wait for auto-detection

## Test Now:

1. **Refresh browser** (Ctrl+F5)
2. **Try login again**
3. **Check console** for detection logs
4. **Click "Manual Verify"** if auto doesn't work
5. **Share console logs** if still not working

The manual verify button should work even if real-time detection isn't working!

