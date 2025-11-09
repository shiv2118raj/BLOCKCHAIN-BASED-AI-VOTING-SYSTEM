# Real-Time Face Verification - Setup Guide

## ✅ What's Been Implemented

I've updated the login page with **real-time face verification** using face-api.js:

### Features:
1. **Real-Time Face Detection**
   - Live face detection every 200ms
   - Visual bounding box around detected face
   - Confidence percentage display

2. **Automatic Verification**
   - Auto-verifies when face confidence ≥ 70%
   - Requires 5 consecutive stable detections (1 second)
   - No need to click "Capture" button

3. **Visual Feedback**
   - Green box when face is detected with high confidence
   - Yellow box for lower confidence
   - Real-time status indicator showing detection confidence
   - "Verifying..." message when auto-verification starts

4. **Manual Override**
   - "Manual Verify" button still available
   - Can manually trigger verification if needed

## 📋 Required: Download Face-API.js Models

The face-api.js library needs model files to work. You need to download them:

### Step 1: Download Models

1. **Go to face-api.js repository:**
   - https://github.com/justadudewhohacks/face-api.js

2. **Download the models:**
   - Go to: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
   - Download these files:
     - `tiny_face_detector_model-weights_manifest.json`
     - `tiny_face_detector_model-shard1`
     - `face_landmark_68_model-weights_manifest.json`
     - `face_landmark_68_model-shard1`
     - `face_recognition_model-weights_manifest.json`
     - `face_recognition_model-shard1`

3. **Place in your project:**
   - Create folder: `public/models/`
   - Put all downloaded files in `public/models/`

### Step 2: Verify Models Are Loaded

After placing models, check browser console:
- Should see: `"[v0] Face recognition models loaded successfully"`
- If you see errors, check that files are in correct location

## 🎯 How It Works

1. **User enters credentials** → Voter ID and Aadhaar number
2. **Camera starts** → Face detection begins automatically
3. **Real-time detection** → Face is detected and tracked
4. **Auto-verification** → When confidence ≥ 70% for 1 second, verification starts
5. **Server verification** → Face is compared with stored face encoding
6. **Login success** → User is authenticated and redirected to dashboard

## 🔧 Configuration

### Detection Settings:
- **Detection interval**: 200ms (5 times per second)
- **Auto-verify threshold**: 70% confidence
- **Stable frames required**: 5 consecutive detections (1 second)
- **Verification threshold**: 50% similarity (already set)

### To Adjust Settings:

Edit `app/auth/login/page.tsx`:

```typescript
// Change auto-verify confidence threshold (line ~198)
if (confidence >= 70 && !isVerifying) { // Change 70 to your desired value

// Change stable frames required (line ~174)
const REQUIRED_STABLE_FRAMES = 5 // Change 5 to your desired value

// Change detection interval (line ~221)
}, 200) // Change 200ms to your desired interval
```

## 🐛 Troubleshooting

### Models Not Loading:
- **Check file location**: Models must be in `public/models/`
- **Check file names**: Must match exactly (case-sensitive)
- **Check browser console**: Look for model loading errors
- **Check network tab**: Verify models are being fetched (status 200)

### Face Not Detecting:
- **Check camera permissions**: Browser must allow camera access
- **Check lighting**: Ensure good lighting on face
- **Check distance**: Face should be clearly visible in frame
- **Check browser console**: Look for detection errors

### Auto-Verification Not Triggering:
- **Check confidence**: Must be ≥ 70% for auto-verify
- **Check stability**: Face must be detected for 1 second continuously
- **Check console**: Look for any errors preventing verification

### Fallback Mode:
If face-api.js models fail to load, the system uses a fallback:
- Basic face detection indicator
- Manual verification still works
- Less accurate but functional

## 📝 Testing Checklist

- [ ] Models downloaded and placed in `public/models/`
- [ ] Browser console shows "Face recognition models loaded successfully"
- [ ] Camera starts when entering face verification
- [ ] Face detection box appears around face
- [ ] Confidence percentage updates in real-time
- [ ] Status indicator shows "Face Detected" when face is visible
- [ ] Auto-verification triggers when confidence ≥ 70%
- [ ] Manual verify button works as backup
- [ ] Verification completes and redirects to dashboard

## 🚀 Next Steps

1. **Download the models** (see Step 1 above)
2. **Restart dev server**: `npm run dev`
3. **Test login** with real-time face verification
4. **Adjust thresholds** if needed (see Configuration section)

The real-time face verification is now fully implemented! Just download the models and it will work.

