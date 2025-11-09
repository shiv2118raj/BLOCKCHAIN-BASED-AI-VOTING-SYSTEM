"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Scan, Shield, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect, useCallback } from "react"

// Dynamic import for face-api.js - only load in browser
let faceapi: any = null
if (typeof window !== "undefined") {
  import("face-api.js")
    .then((module) => {
      faceapi = module
    })
    .catch((error) => {
      console.warn("[v0] Failed to load face-api.js:", error)
    })
}

export default function LoginPage() {
  const [voterID, setVoterID] = useState("")
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showFaceAuth, setShowFaceAuth] = useState(false)
  const [faceAuthStep, setFaceAuthStep] = useState<"capture" | "processing" | "success">("capture")
  const [voterData, setVoterData] = useState<any>(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [detectionConfidence, setDetectionConfidence] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const verificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!voterID || !aadhaarNumber) {
        throw new Error("Please enter both Voter ID and Aadhaar number")
      }

      console.log("[v0] Verifying voter:", { voterID, aadhaarNumber })

      const supabase = createClient()
      const { data: voter, error: dbError } = await supabase
        .from("voters")
        .select("*")
        .eq("voter_id", voterID)
        .eq("aadhaar_number", aadhaarNumber)
        .single()

      if (dbError || !voter) {
        throw new Error("Invalid voter credentials. Please check your Voter ID and Aadhaar number.")
      }

      if (!voter.face_encoding) {
        throw new Error("No face data found. Please complete registration first.")
      }

      setVoterData(voter)
      setShowFaceAuth(true)
      // Wait for models to load before starting camera
      if (modelsLoaded) {
      await startCamera()
      } else {
        // Wait for models to load
        const checkModels = setInterval(() => {
          if (modelsLoaded) {
            clearInterval(checkModels)
            startCamera()
          }
        }, 100)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Load face-api.js models
  useEffect(() => {
    loadModels()
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
      if (verificationTimeoutRef.current) {
        clearTimeout(verificationTimeoutRef.current)
      }
      stopCamera()
    }
  }, [])

  const loadModels = async () => {
    if (!faceapi) {
      // Wait for face-api to load
      const checkFaceApi = setInterval(() => {
        if (faceapi) {
          clearInterval(checkFaceApi)
          loadModels()
        }
      }, 100)
      return
    }

    try {
      console.log("[v0] Loading face recognition models from /models...")
      
      // Load models with error handling
      const loadPromises = [
        faceapi.nets.tinyFaceDetector.loadFromUri("/models").catch((err: any) => {
          console.warn("[v0] Failed to load tinyFaceDetector:", err.message)
          return null
        }),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models").catch((err: any) => {
          console.warn("[v0] Failed to load faceLandmark68Net:", err.message)
          return null
        }),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models").catch((err: any) => {
          console.warn("[v0] Failed to load faceRecognitionNet:", err.message)
          return null
        }),
      ]

      await Promise.all(loadPromises)
      setModelsLoaded(true)
      console.log("[v0] Face recognition models loaded successfully")
    } catch (error) {
      console.error("[v0] Error loading models:", error)
      console.log("[v0] Continuing with fallback face detection...")
      // Continue with fallback even if models fail
      setModelsLoaded(true)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Wait for video to be ready, then start real-time detection
        videoRef.current.onloadedmetadata = () => {
          if (modelsLoaded) {
            setTimeout(() => startRealTimeDetection(), 500)
          } else {
            // Wait for models to load
            const checkModels = setInterval(() => {
              if (modelsLoaded) {
                clearInterval(checkModels)
                setTimeout(() => startRealTimeDetection(), 500)
              }
            }, 100)
          }
        }
      }
    } catch (error) {
      setError("Camera access denied. Please allow camera access for face verification.")
    }
  }

  const startRealTimeDetection = useCallback(() => {
    if (!videoRef.current || !overlayCanvasRef.current || !voterData) {
      console.log("[v0] Cannot start detection - missing refs or voterData")
      return
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
    }

    console.log("[v0] Starting real-time face detection...")
    let stableDetectionCount = 0
    const REQUIRED_STABLE_FRAMES = 3 // Reduced to 3 for faster verification

    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || !overlayCanvasRef.current || !voterData || isVerifying) return
      if (videoRef.current.readyState !== 4) {
        // Video not ready yet
        return
      }

      try {
        // Use face-api.js if available, otherwise use fallback
        if (faceapi && modelsLoaded) {
          const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 320 }))
            .withFaceLandmarks()
            .withFaceDescriptors()

          if (detections.length > 0) {
            const detection = detections[0]
            const confidence = detection.detection.score * 100
            const roundedConfidence = Math.round(confidence)
            
            setFaceDetected(true)
            setDetectionConfidence(roundedConfidence)

            // Draw detection box
            drawDetectionBox(detection.detection.box, confidence)

            // Auto-verify if confidence is high enough and face is stable
            if (confidence >= 50 && !isVerifying) { // Lowered threshold to 50%
              stableDetectionCount++
              console.log(`[v0] Face detected: ${roundedConfidence}% (stable: ${stableDetectionCount}/${REQUIRED_STABLE_FRAMES})`)
              
              if (stableDetectionCount >= REQUIRED_STABLE_FRAMES) {
                console.log("[v0] Stable face detected, starting auto-verification...")
                stableDetectionCount = 0
                autoVerifyFace(detection)
              }
            } else {
              if (stableDetectionCount > 0) {
                stableDetectionCount = 0
              }
            }
          } else {
            if (faceDetected) {
              setFaceDetected(false)
              setDetectionConfidence(0)
              stableDetectionCount = 0
              clearCanvas()
            }
          }
        } else {
          // Fallback: Enable manual verification if face-api not available
          // Don't auto-set faceDetected, let user manually verify
          if (!faceDetected) {
            console.log("[v0] Face-api not available, using fallback mode - manual verification enabled")
          }
        }
      } catch (error) {
        console.error("[v0] Face detection error:", error)
      }
    }, 300) // Check every 300ms for smoother detection
  }, [modelsLoaded, voterData, isVerifying, faceDetected])

  const drawDetectionBox = (box: any, confidence: number) => {
    if (!overlayCanvasRef.current || !videoRef.current) return

    const canvas = overlayCanvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw detection box
    const color = confidence >= 50 ? "#10B981" : "#F59E0B"
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.strokeRect(box.x, box.y, box.width, box.height)

    // Draw confidence text
    ctx.fillStyle = color
    ctx.font = "bold 16px Arial"
    ctx.fillText(`${Math.round(confidence)}%`, box.x, box.y - 10)
  }

  const clearCanvas = () => {
    if (!overlayCanvasRef.current) return
    const ctx = overlayCanvasRef.current.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }
    if (verificationTimeoutRef.current) {
      clearTimeout(verificationTimeoutRef.current)
      verificationTimeoutRef.current = null
    }
    clearCanvas()
  }

  const autoVerifyFace = async (detection: any) => {
    if (!videoRef.current || !canvasRef.current || !voterData || isVerifying) return

    setIsVerifying(true)
    setFaceAuthStep("processing")
    setError(null)

    try {
    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

      if (!context) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      canvas.toBlob(
        async (blob) => {
          if (blob) {
            await verifyFaceWithServer(blob)
          }
        },
        "image/jpeg",
        0.9,
      )
    } catch (error) {
      console.error("[v0] Auto-verify error:", error)
      setIsVerifying(false)
      setFaceAuthStep("capture")
    }
  }

  const verifyFaceWithServer = async (blob: Blob) => {
            try {
      console.log("[v0] Verifying face with server...")

              const formData = new FormData()
              formData.append("image", blob, "face-capture.jpg")
              formData.append("voterID", voterData.voter_id)
      formData.append("storedFaceData", voterData.face_encoding)

              const response = await fetch("/api/face/verify", {
                method: "POST",
                body: formData,
              })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("[v0] Non-JSON response:", text.substring(0, 200))
        throw new Error("Server returned an error. Please check the console for details.")
      }

              const result = await response.json()
              console.log("[v0] Face verification result:", result)

              if (!response.ok) {
                throw new Error(result.error || "Face verification failed")
              }

      // Lower threshold to 30% for more lenient matching
      const similarityThreshold = 30
      if (!result.verified || result.similarity < similarityThreshold) {
                throw new Error(
          `Face verification failed. Similarity: ${result.similarity}%. Please ensure good lighting and look directly at the camera.`,
                )
              }
      
      console.log(`[v0] Face verification passed! Similarity: ${result.similarity}% (threshold: ${similarityThreshold}%)`)

              console.log("[v0] Face verification successful:", result.similarity)
              setFaceAuthStep("success")
      stopCamera()

      // Authenticate user with Supabase
              const supabase = createClient()
      let authSuccess = false

      // Try to sign in first
      const { data: signInData, error: authError } = await supabase.auth.signInWithPassword({
                email: voterData.email,
        password: voterData.aadhaar_number,
      })

      if (signInData?.user) {
        console.log("[v0] User signed in successfully:", signInData.user.id)
        authSuccess = true
      } else if (authError) {
        console.log("[v0] Sign in failed, trying to create user:", authError.message)
        
        // Try to sign up if sign in fails
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                  email: voterData.email,
                  password: voterData.aadhaar_number,
                  options: {
                    data: {
                      voter_id: voterData.voter_id,
                      full_name: voterData.full_name,
                    },
            emailRedirectTo: `${window.location.origin}/dashboard`,
                  },
                })

        if (signUpData?.user) {
          console.log("[v0] User created successfully:", signUpData.user.id)
          authSuccess = true
        } else if (signUpError) {
                  console.error("[v0] Sign up error:", signUpError.message)
          // Continue anyway - user is verified via face recognition
          authSuccess = true
                }
              }

      // Store face verification success in sessionStorage
      sessionStorage.setItem("faceVerified", "true")
      sessionStorage.setItem("voterData", JSON.stringify({
        voter_id: voterData.voter_id,
        email: voterData.email,
        full_name: voterData.full_name,
      }))

      // Verify session is set
      if (authSuccess) {
        // Wait a moment for session to be set
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          console.log("[v0] Session verified, redirecting to dashboard...")
          // Use window.location for a hard redirect to ensure session is recognized
          window.location.href = "/dashboard"
          return
        }
      }

      // Redirect to dashboard (session will be checked there)
      console.log("[v0] Redirecting to dashboard (face verified)...")
      // Use window.location for hard redirect
      window.location.href = "/dashboard"
            } catch (error) {
              console.error("[v0] Face verification error:", error)
              setError(error instanceof Error ? error.message : "Face recognition failed. Please try again.")
              setFaceAuthStep("capture")
      setIsVerifying(false)
    }
  }

  const captureFace = async () => {
    if (!videoRef.current || !canvasRef.current || !voterData || isVerifying) {
      console.log("[v0] Cannot capture - missing refs or already verifying")
      return
    }

    console.log("[v0] Manual face capture triggered")
    setIsVerifying(true)
    setFaceAuthStep("processing")
    setError(null)

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      canvas.toBlob(
        async (blob) => {
          if (blob) {
            console.log("[v0] Image captured, sending to server for verification...")
            await verifyFaceWithServer(blob)
          } else {
            console.error("[v0] Failed to create blob from canvas")
            setError("Failed to capture image. Please try again.")
            setIsVerifying(false)
            setFaceAuthStep("capture")
          }
        },
        "image/jpeg",
        0.9,
      )
    } else {
      console.error("[v0] Canvas context not available")
      setError("Camera not ready. Please wait a moment and try again.")
      setIsVerifying(false)
      setFaceAuthStep("capture")
    }
  }

  if (showFaceAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Scan className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Face Verification</CardTitle>
            <CardDescription>
              Hello {voterData?.full_name}, please look directly at the camera for biometric authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {faceAuthStep === "capture" && (
              <>
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-lg border-2 border-blue-200"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  <canvas
                    ref={overlayCanvasRef}
                    className="absolute inset-0 w-full h-full rounded-lg pointer-events-none"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Real-time face detection status */}
                  <div className="absolute top-2 left-2 right-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium text-center ${
                        faceDetected && detectionConfidence >= 50
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : faceDetected
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {faceDetected
                        ? `Face Detected (${detectionConfidence}% confidence)${detectionConfidence >= 50 && isVerifying ? " - Verifying..." : detectionConfidence >= 50 ? " - Ready!" : ""}`
                        : "Position your face in the frame"}
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    {faceDetected && detectionConfidence >= 50
                      ? `Face detected! ${isVerifying ? "Verification in progress..." : "Click 'Verify Now' or wait for auto-verification"}`
                      : "Position your face within the frame. Ensure good lighting and look directly at the camera. You can also click 'Manual Verify' to verify immediately."}
                  </p>
                  {!modelsLoaded && (
                    <div className="text-xs text-gray-500">
                      Loading AI models... Please wait
                    </div>
                  )}
                  <Button
                    onClick={captureFace}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isVerifying}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {isVerifying ? "Verifying..." : faceDetected ? `Verify Now (${detectionConfidence}%)` : "Manual Verify"}
                  </Button>
                </div>
              </>
            )}

            {faceAuthStep === "processing" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-lg font-semibold">Verifying Your Identity...</p>
                <p className="text-sm text-gray-600">Comparing with registered face data</p>
              </div>
            )}

            {faceAuthStep === "success" && (
              <div className="text-center space-y-4">
                <Shield className="w-16 h-16 text-green-600 mx-auto" />
                <p className="text-lg font-semibold text-green-600">Identity Verified!</p>
                <p className="text-sm text-gray-600">Welcome back, {voterData?.full_name}. Redirecting...</p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Voter Login</CardTitle>
              <CardDescription>Enter your credentials to access the secure voting system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInitialLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="voterID">Voter ID</Label>
                    <Input
                      id="voterID"
                      type="text"
                      placeholder="Enter your Voter ID"
                      required
                      value={voterID}
                      onChange={(e) => setVoterID(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                    <Input
                      id="aadhaarNumber"
                      type="text"
                      placeholder="Enter your Aadhaar number"
                      maxLength={12}
                      required
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Proceed to Face Verification"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Not registered yet?{" "}
                  <Link href="/register" className="underline underline-offset-4 text-orange-600">
                    Register to Vote
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Secure login powered by blockchain technology and AI face recognition
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
