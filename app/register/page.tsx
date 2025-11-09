"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, CheckCircle, AlertCircle, Scan } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    voterID: "",
    aadhaarNumber: "",
    fullName: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
    email: "",
  })
  const [faceImage, setFaceImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraReady(true)
      }
    } catch (error) {
      setError("Camera access denied. Please allow camera access for face registration.")
      setShowCamera(false)
    }
  }

  const captureFace = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setError(null)
    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)

      // Stop camera
      const stream = video.srcObject as MediaStream
      stream?.getTracks().forEach((track) => track.stop())

      // Convert canvas to blob
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            // Create a File object from the blob
            const file = new File([blob], "face-capture.jpg", { type: "image/jpeg" })
      setFaceImage(file)
            setShowCamera(false)
            setCameraReady(false)
    }
        },
        "image/jpeg",
        0.9,
      )
    }
  }

  const openCamera = () => {
    setShowCamera(true)
    // Start camera after a brief delay to ensure the video element is ready
    setTimeout(() => {
      startCamera()
    }, 100)
  }

  const closeCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
    setShowCamera(false)
    setCameraReady(false)
  }

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.voterID || !formData.aadhaarNumber || !formData.fullName || !formData.email || !formData.dateOfBirth || !formData.address) {
        throw new Error("Please fill all required fields including email, date of birth, and address")
      }

      // Validate face image
      if (!faceImage) {
        throw new Error("Please capture your face using the webcam")
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      // Validate Aadhaar number (12 digits)
      if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
        throw new Error("Aadhaar number must be 12 digits")
      }

      console.log("[v0] Submitting registration data:", formData.voterID)

      // Create FormData to send to API
      const registrationFormData = new FormData()
      registrationFormData.append("voterID", formData.voterID)
      registrationFormData.append("aadhaarNumber", formData.aadhaarNumber)
      registrationFormData.append("fullName", formData.fullName)
      registrationFormData.append("dateOfBirth", formData.dateOfBirth)
      registrationFormData.append("address", formData.address)
      registrationFormData.append("phoneNumber", formData.phoneNumber || "")
      registrationFormData.append("email", formData.email || "")
      registrationFormData.append("faceImage", faceImage)

      // Send registration data to API
      const response = await fetch("/api/register", {
        method: "POST",
        body: registrationFormData,
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("[v0] Non-JSON response:", text.substring(0, 200))
        throw new Error("Server returned an error. Please check the console for details.")
      }

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Registration failed")
      }

      console.log("[v0] Registration successful:", result.message)
      setSuccess(true)
      setTimeout(() => {
        router.push("/register/success")
      }, 2000)
    } catch (error: unknown) {
      console.error("[v0] Registration error:", error)
      setError(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">Registration Successful!</CardTitle>
            <CardDescription>Your voter registration has been submitted for verification.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              You will receive a confirmation email once your identity is verified by our system.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Voter Registration</span>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Registration Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Voter Registration</h1>
            <p className="text-gray-600">Register to participate in secure blockchain-based voting</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Please provide accurate information as per your official documents</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="voterID">Voter ID Number *</Label>
                    <Input
                      id="voterID"
                      name="voterID"
                      placeholder="Enter your Voter ID"
                      value={formData.voterID}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                    <Input
                      id="aadhaarNumber"
                      name="aadhaarNumber"
                      placeholder="Enter 12-digit Aadhaar number"
                      maxLength={12}
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name as per Aadhaar"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter your mobile number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>

                {/* Face Photo Capture */}
                <div className="space-y-4">
                  <Label>Face Photo for Recognition *</Label>
                  {!showCamera && !faceImage && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                        Capture your face using your webcam for biometric verification
                    </p>
                      <Button type="button" onClick={openCamera} variant="outline" className="bg-transparent">
                        <Camera className="w-4 h-4 mr-2" />
                        Open Camera
                      </Button>
                    </div>
                  )}

                  {showCamera && (
                    <Card>
                      <CardHeader className="text-center pb-4">
                        <Scan className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                        <CardTitle className="text-lg">Face Capture</CardTitle>
                        <CardDescription>
                          Position your face within the frame. Ensure good lighting and look directly at the camera.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="relative">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full rounded-lg border-2 border-blue-200"
                            style={{ transform: "scaleX(-1)" }}
                          />
                          <canvas ref={canvasRef} className="hidden" />
                          <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none opacity-50" />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={captureFace}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={!cameraReady}
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Capture Photo
                          </Button>
                          <Button type="button" onClick={closeCamera} variant="outline">
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {faceImage && !showCamera && (
                    <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <p className="text-sm text-green-700 font-medium">Face captured successfully!</p>
                        </div>
                        <Button type="button" onClick={openCamera} variant="ghost" size="sm">
                          Retake
                        </Button>
                      </div>
                  </div>
                  )}
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
                  {isLoading ? "Processing Registration..." : "Register to Vote"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By registering, you agree to our terms of service and privacy policy. Your biometric data will be
                  securely encrypted and used only for voter verification.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
