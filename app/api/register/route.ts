import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { FaceRecognitionService } from "@/lib/face-recognition/face-service"

export async function POST(request: NextRequest) {
  try {
    // Ensure we can parse the form data
    let formData: FormData
    try {
      formData = await request.formData()
    } catch (error) {
      console.error("[v0] FormData parsing error:", error)
      return NextResponse.json(
        { success: false, error: "Invalid request format" },
        { status: 400 }
      )
    }
    const voterID = formData.get("voterID") as string
    const aadhaarNumber = formData.get("aadhaarNumber") as string
    const fullName = formData.get("fullName") as string
    const dateOfBirth = formData.get("dateOfBirth") as string
    const address = formData.get("address") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const email = formData.get("email") as string
    const faceImage = formData.get("faceImage") as File

    // Validate required fields
    if (!voterID || !aadhaarNumber || !fullName || !dateOfBirth || !address || !email || !faceImage) {
      return NextResponse.json(
        { success: false, error: "Please fill all required fields including email, date of birth, and address" },
        { status: 400 }
      )
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address" }, { status: 400 })
    }

    console.log("[v0] Processing registration for voter:", voterID)

    const supabase = await createServerClient()
    const faceService = FaceRecognitionService.getInstance()

    // Load face recognition models
    await faceService.loadModels()

    // Convert image file to base64 for processing
    const arrayBuffer = await faceImage.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = buffer.toString("base64")
    const imageDataUrl = `data:${faceImage.type};base64,${base64Image}`

    // Extract face descriptor from the image
    // The service can handle base64 string directly
    const faceDescriptor = await faceService.extractFaceDescriptor(imageDataUrl)

    console.log("[v0] Face descriptor extracted:", faceDescriptor ? "Success" : "Failed")

    if (!faceDescriptor) {
      return NextResponse.json({ success: false, error: "Could not extract face features from image" }, { status: 400 })
    }

    // Encode face descriptor for storage
    const faceEncoding = faceService.encodeDescriptor(faceDescriptor)

    // Check if voter already exists
    const { data: existingVoter } = await supabase.from("voters").select("id").eq("voter_id", voterID).single()

    if (existingVoter) {
      return NextResponse.json({ success: false, error: "Voter ID already registered" }, { status: 400 })
    }

    // Check if Aadhaar number already exists
    const { data: existingAadhaar } = await supabase
      .from("voters")
      .select("id")
      .eq("aadhaar_number", aadhaarNumber)
      .single()

    if (existingAadhaar) {
      return NextResponse.json({ success: false, error: "Aadhaar number already registered" }, { status: 400 })
    }

    // Insert voter data into database
    const { data: voter, error: insertError } = await supabase
      .from("voters")
      .insert({
        voter_id: voterID,
        aadhaar_number: aadhaarNumber,
        full_name: fullName,
        date_of_birth: dateOfBirth || null,
        address: address,
        phone_number: phoneNumber || null,
        email: email,
        face_encoding: faceEncoding,
        is_verified: false, // Require manual verification
        is_active: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Database insert error:", insertError)
      return NextResponse.json(
        { success: false, error: `Registration failed: ${insertError.message}` },
        { status: 500 }
      )
    }

    console.log("[v0] Voter registered successfully:", voter.id)

    return NextResponse.json({
      success: true,
      message: "Registration successful! Your account is pending verification.",
      voterId: voter.id,
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 }
    )
  }
}

