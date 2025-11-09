import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { FaceRecognitionService } from "@/lib/face-recognition/face-service"

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""
    let voterID: string
    let currentFace: any
    let storedFaceData: string | undefined

    const supabase = await createServerClient()
    const faceService = FaceRecognitionService.getInstance()

    // Load models if not already loaded
    await faceService.loadModels()

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData from login page
      const formData = await request.formData()
      const imageFile = formData.get("image") as File
      voterID = formData.get("voterID") as string
      storedFaceData = formData.get("storedFaceData") as string | undefined

      if (!voterID || !imageFile) {
        return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
      }

      // Convert image file to base64 for processing
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64Image = buffer.toString("base64")
      const imageDataUrl = `data:${imageFile.type};base64,${base64Image}`

      // Extract face descriptor from image
      const faceDescriptor = await faceService.extractFaceDescriptor(imageDataUrl)
      if (!faceDescriptor) {
        return NextResponse.json({ success: false, error: "Could not extract face features from image" }, { status: 400 })
      }
      currentFace = faceDescriptor
    } else {
      // Handle JSON (legacy support)
      const body = await request.json()
      voterID = body.voterID
      storedFaceData = body.storedFaceData

      if (!voterID || !body.faceData) {
        return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
      }

      // Decode face descriptors from JSON
      currentFace = faceService.decodeDescriptor(body.faceData)
    }

    console.log(`[v0] Verifying face for voter: ${voterID}`)

    let similarity = 0

    if (storedFaceData) {
      // Compare with provided stored face data
      const storedFace = faceService.decodeDescriptor(storedFaceData)
      similarity = await faceService.compareFaces(currentFace.descriptor, storedFace.descriptor)
    } else {
      // Fetch stored face data from database
      const { data: voter, error } = await supabase
        .from("voters")
        .select("face_encoding")
        .eq("voter_id", voterID)
        .single()

      if (error || !voter?.face_encoding) {
        console.log(`[v0] Voter face data not found for: ${voterID}`)
        return NextResponse.json({ success: false, error: "Voter face data not found" }, { status: 404 })
      }

      const storedFace = faceService.decodeDescriptor(voter.face_encoding)
      similarity = await faceService.compareFaces(currentFace.descriptor, storedFace.descriptor)
    }

    // Lower threshold to 30% for more lenient matching
    const VERIFICATION_THRESHOLD = 30
    const isVerified = similarity >= VERIFICATION_THRESHOLD

    console.log(`[v0] Face verification result - Similarity: ${similarity.toFixed(2)}%, Verified: ${isVerified}`)

    // Note: vote_verification table requires a vote_id, so we don't insert here during login
    // Face verification during login is just for authentication, not vote verification

    if (similarity > 99.5) {
      console.log(`[v0] Suspicious similarity score detected: ${similarity}% - potential spoofing attempt`)
      return NextResponse.json({
        success: true,
        verified: false,
        similarity: Math.round(similarity),
        confidence: currentFace.confidence,
        timestamp: new Date().toISOString(),
        reason: "Security validation failed",
      })
    }

    return NextResponse.json({
      success: true,
      verified: isVerified,
      similarity: Math.round(similarity),
      confidence: currentFace.confidence,
      timestamp: new Date().toISOString(),
      threshold: VERIFICATION_THRESHOLD,
    })
  } catch (error) {
    console.error("Face verification error:", error)
    return NextResponse.json({ success: false, error: "Face verification failed" }, { status: 500 })
  }
}
