import { NextResponse } from "next/server"
import { getVoteService } from "@/lib/voting/vote-service"

export async function GET() {
  try {
    const voteService = getVoteService()
    const stats = voteService.getBlockchainStats()

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("[v0] Blockchain stats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
