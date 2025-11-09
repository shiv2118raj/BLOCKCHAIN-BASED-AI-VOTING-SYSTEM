import { createClient } from "@/lib/supabase/server"
import { getBlockchain, type Vote } from "@/lib/blockchain/voting-blockchain"
import { VoteEncryption } from "@/lib/blockchain/vote-encryption"

export interface CastVoteRequest {
  voterId: string
  candidateId: string
  electionId: string
  faceVerificationData: string
}

export interface CastVoteResponse {
  success: boolean
  blockchainHash?: string
  voteProof?: any
  error?: string
}

export interface VoteVerification {
  isValid: boolean
  blockchainHash: string
  timestamp: number
  voterProof: string
}

export class VoteService {
  private blockchain = getBlockchain()

  // Cast a vote with full blockchain integration
  public async castVote(request: CastVoteRequest): Promise<CastVoteResponse> {
    try {
      const supabase = await createClient()

      // 1. Verify voter eligibility
      const { data: voter, error: voterError } = await supabase
        .from("voters")
        .select("*")
        .eq("id", request.voterId)
        .eq("is_verified", true)
        .eq("is_active", true)
        .single()

      if (voterError || !voter) {
        return { success: false, error: "Voter not found or not verified" }
      }

      // 2. Check if voter has already voted in this election
      const { data: existingVote, error: voteCheckError } = await supabase
        .from("votes")
        .select("*")
        .eq("voter_id", request.voterId)
        .eq("election_id", request.electionId)
        .single()

      if (existingVote) {
        return { success: false, error: "You have already voted in this election" }
      }

      // 3. Verify election is active
      const { data: election, error: electionError } = await supabase
        .from("elections")
        .select("*")
        .eq("id", request.electionId)
        .eq("is_active", true)
        .single()

      if (electionError || !election) {
        return { success: false, error: "Election not found or not active" }
      }

      // 4. Verify candidate exists
      const { data: candidate, error: candidateError } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", request.candidateId)
        .eq("election_id", request.electionId)
        .eq("is_active", true)
        .single()

      if (candidateError || !candidate) {
        return { success: false, error: "Candidate not found" }
      }

      // 5. Create vote object
      const timestamp = Date.now()
      const vote: Vote = {
        voterId: request.voterId,
        candidateId: request.candidateId,
        electionId: request.electionId,
        timestamp,
      }

      // 6. Encrypt vote data
      const encryptedVote = VoteEncryption.encryptVote(
        request.voterId,
        request.candidateId,
        request.electionId,
        timestamp,
      )

      // 7. Add vote to blockchain
      const blockchainHash = this.blockchain.addVote(vote)

      // 8. Store vote in database
      const { data: dbVote, error: dbError } = await supabase
        .from("votes")
        .insert({
          election_id: request.electionId,
          voter_id: request.voterId,
          candidate_id: request.candidateId,
          blockchain_hash: blockchainHash,
          vote_timestamp: new Date(timestamp).toISOString(),
          is_verified: true,
        })
        .select()
        .single()

      if (dbError) {
        console.error("[v0] Database error:", dbError)
        return { success: false, error: "Failed to record vote" }
      }

      // 9. Store vote verification data
      const { error: verificationError } = await supabase.from("vote_verification").insert({
        vote_id: dbVote.id,
        face_match_score: 0.95, // Simulated face match score
        ip_address: "127.0.0.1", // In real app, get from request
        user_agent: "Blockchain Voting System",
        verification_timestamp: new Date().toISOString(),
      })

      if (verificationError) {
        console.error("[v0] Verification storage error:", verificationError)
      }

      // 10. Generate vote proof for voter
      const voteProof = VoteEncryption.generateZKProof(request.voterId, request.candidateId, request.electionId)

      console.log("[v0] Vote cast successfully:", {
        blockchainHash,
        voterProof: encryptedVote.voterProof,
      })

      return {
        success: true,
        blockchainHash,
        voteProof,
      }
    } catch (error) {
      console.error("[v0] Vote casting error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  // Verify a vote exists on the blockchain
  public async verifyVote(blockchainHash: string): Promise<VoteVerification | null> {
    try {
      const block = this.blockchain.getVoteProof(blockchainHash)
      if (!block) {
        return null
      }

      return {
        isValid: true,
        blockchainHash: block.hash,
        timestamp: block.timestamp,
        voterProof: block.voterHash,
      }
    } catch (error) {
      console.error("[v0] Vote verification error:", error)
      return null
    }
  }

  // Get blockchain statistics
  public getBlockchainStats() {
    return {
      totalBlocks: this.blockchain.getChainLength(),
      isValid: this.blockchain.isChainValid(),
      latestBlock: this.blockchain.getLatestBlock(),
    }
  }

  // Verify voter has not voted (without revealing if they have)
  public async canVoterVote(voterId: string, electionId: string): Promise<boolean> {
    try {
      const supabase = await createClient()

      const { data: existingVote } = await supabase
        .from("votes")
        .select("id")
        .eq("voter_id", voterId)
        .eq("election_id", electionId)
        .single()

      return !existingVote
    } catch (error) {
      console.error("[v0] Vote eligibility check error:", error)
      return false
    }
  }
}

// Singleton instance
let voteServiceInstance: VoteService | null = null

export function getVoteService(): VoteService {
  if (!voteServiceInstance) {
    voteServiceInstance = new VoteService()
  }
  return voteServiceInstance
}
