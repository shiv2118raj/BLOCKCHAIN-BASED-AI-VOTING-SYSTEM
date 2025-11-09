import { type NextRequest, NextResponse } from "next/server"
import { getVoteService } from "@/lib/voting/vote-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blockchainHash } = body

    if (!blockchainHash) {
      return NextResponse.json({ error: "Blockchain hash is required" }, { status: 400 })
    }

    const voteService = getVoteService()
    const verification = await voteService.verifyVote(blockchainHash)

    if (!verification) {
      return NextResponse.json({ error: "Vote not found on blockchain" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      verification,
    })
  } catch (error) {
    console.error("[v0] Vote verification API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
