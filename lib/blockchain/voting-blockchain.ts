import { createHash } from "crypto"

export interface VoteBlock {
  index: number
  timestamp: number
  voterHash: string // Anonymized voter identifier
  candidateHash: string // Encrypted candidate choice
  previousHash: string
  hash: string
  nonce: number
  merkleRoot: string
}

export interface Vote {
  voterId: string
  candidateId: string
  electionId: string
  timestamp: number
}

export class VotingBlockchain {
  private chain: VoteBlock[]
  private difficulty: number
  private pendingVotes: Vote[]
  private miningReward: number

  constructor() {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 4 // Number of leading zeros required in hash
    this.pendingVotes = []
    this.miningReward = 0 // No mining reward for voting
  }

  private createGenesisBlock(): VoteBlock {
    const genesisBlock: VoteBlock = {
      index: 0,
      timestamp: Date.now(),
      voterHash: "0",
      candidateHash: "0",
      previousHash: "0",
      hash: "",
      nonce: 0,
      merkleRoot: "0",
    }
    genesisBlock.hash = this.calculateHash(genesisBlock)
    return genesisBlock
  }

  private calculateHash(block: VoteBlock): string {
    return createHash("sha256")
      .update(
        block.index +
          block.timestamp +
          block.voterHash +
          block.candidateHash +
          block.previousHash +
          block.nonce +
          block.merkleRoot,
      )
      .digest("hex")
  }

  private calculateMerkleRoot(votes: Vote[]): string {
    if (votes.length === 0) return "0"

    let hashes = votes.map((vote) =>
      createHash("sha256")
        .update(vote.voterId + vote.candidateId + vote.electionId + vote.timestamp)
        .digest("hex"),
    )

    while (hashes.length > 1) {
      const newHashes: string[] = []
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i]
        const right = i + 1 < hashes.length ? hashes[i + 1] : left
        const combined = createHash("sha256")
          .update(left + right)
          .digest("hex")
        newHashes.push(combined)
      }
      hashes = newHashes
    }

    return hashes[0]
  }

  public getLatestBlock(): VoteBlock {
    return this.chain[this.chain.length - 1]
  }

  public addVote(vote: Vote): string {
    // Add vote to pending votes
    this.pendingVotes.push(vote)

    // Create new block with the vote
    const newBlock = this.createVoteBlock(vote)

    // Mine the block
    this.mineBlock(newBlock)

    // Add to chain
    this.chain.push(newBlock)

    // Clear pending votes
    this.pendingVotes = []

    console.log("[v0] Vote added to blockchain:", newBlock.hash)
    return newBlock.hash
  }

  private createVoteBlock(vote: Vote): VoteBlock {
    const previousBlock = this.getLatestBlock()

    // Create anonymized hashes
    const voterHash = this.anonymizeVoter(vote.voterId, vote.electionId)
    const candidateHash = this.encryptCandidate(vote.candidateId, vote.voterId)

    const block: VoteBlock = {
      index: previousBlock.index + 1,
      timestamp: vote.timestamp,
      voterHash,
      candidateHash,
      previousHash: previousBlock.hash,
      hash: "",
      nonce: 0,
      merkleRoot: this.calculateMerkleRoot([vote]),
    }

    return block
  }

  private anonymizeVoter(voterId: string, electionId: string): string {
    // Create anonymous but verifiable voter hash
    return createHash("sha256")
      .update(voterId + electionId + "voter_salt_2024")
      .digest("hex")
  }

  private encryptCandidate(candidateId: string, voterId: string): string {
    // Encrypt candidate choice with voter-specific key
    return createHash("sha256")
      .update(candidateId + voterId + "candidate_salt_2024")
      .digest("hex")
  }

  private mineBlock(block: VoteBlock): void {
    const target = Array(this.difficulty + 1).join("0")

    while (block.hash.substring(0, this.difficulty) !== target) {
      block.nonce++
      block.hash = this.calculateHash(block)
    }

    console.log("[v0] Block mined:", block.hash)
  }

  public isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      // Verify current block hash
      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        console.log("[v0] Invalid hash at block", i)
        return false
      }

      // Verify link to previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log("[v0] Invalid previous hash at block", i)
        return false
      }
    }

    return true
  }

  public getVoteProof(blockHash: string): VoteBlock | null {
    return this.chain.find((block) => block.hash === blockHash) || null
  }

  public getChainLength(): number {
    return this.chain.length
  }

  public getBlockByIndex(index: number): VoteBlock | null {
    return this.chain[index] || null
  }

  // Verify a vote exists without revealing the choice
  public verifyVoteExists(voterHash: string, electionId: string): boolean {
    return this.chain.some((block) => {
      if (block.index === 0) return false // Skip genesis block
      return block.voterHash === voterHash
    })
  }
}

// Singleton instance
let blockchainInstance: VotingBlockchain | null = null

export function getBlockchain(): VotingBlockchain {
  if (!blockchainInstance) {
    blockchainInstance = new VotingBlockchain()
  }
  return blockchainInstance
}
