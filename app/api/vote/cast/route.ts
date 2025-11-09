import { type NextRequest, NextResponse } from "next/server"
import { getVoteService } from "@/lib/voting/vote-service"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { candidateId, electionId, faceVerificationData } = body

    if (!candidateId || !electionId || !faceVerificationData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Extract voter ID from user (in real app, this would be properly mapped)
    const voterId = user.id

    const voteService = getVoteService()

    // Cast the vote
    const result = await voteService.castVote({
      voterId,
      candidateId,
      electionId,
      faceVerificationData,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      blockchainHash: result.blockchainHash,
      voteProof: result.voteProof,
    })
  } catch (error) {
    console.error("[v0] Vote casting API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
