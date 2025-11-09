"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Search, Shield, CheckCircle, AlertCircle, Hash, Clock } from "lucide-react"
import Link from "next/link"

interface VoteVerification {
  isValid: boolean
  blockchainHash: string
  timestamp: number
  voterProof: string
}

export default function VoteVerifyPage() {
  const [blockchainHash, setBlockchainHash] = useState("")
  const [verification, setVerification] = useState<VoteVerification | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!blockchainHash.trim()) {
      setError("Please enter a blockchain hash")
      return
    }

    setIsLoading(true)
    setError(null)
    setVerification(null)

    try {
      const response = await fetch("/api/vote/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blockchainHash: blockchainHash.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setVerification(data.verification)
      } else {
        setError(data.error || "Vote verification failed")
      }
    } catch (error) {
      setError("Network error occurred")
      console.error("[v0] Vote verification error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Vote Verification</h1>
                <p className="text-sm text-gray-600">Verify your vote on the blockchain</p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Verify Your Vote</h1>
            <p className="text-gray-600">
              Enter your blockchain transaction hash to verify that your vote was successfully recorded
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Blockchain Hash Verification
              </CardTitle>
              <CardDescription>Enter the blockchain hash you received after casting your vote</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="blockchainHash">Blockchain Transaction Hash</Label>
                  <Input
                    id="blockchainHash"
                    type="text"
                    placeholder="Enter your blockchain hash (e.g., 0x1a2b3c4d...)"
                    value={blockchainHash}
                    onChange={(e) => setBlockchainHash(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    This hash was provided to you after successfully casting your vote
                  </p>
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
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Verify Vote
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Verification Result */}
          {verification && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <CardTitle className="text-green-900">Vote Verified Successfully!</CardTitle>
                    <CardDescription className="text-green-700">
                      Your vote has been found on the blockchain
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Status</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Valid
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Blockchain Hash</span>
                    </div>
                    <span className="font-mono text-xs text-gray-600">
                      {verification.blockchainHash.substring(0, 16)}...
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="font-medium">Timestamp</span>
                    </div>
                    <span className="text-sm">{new Date(verification.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Voter Proof</span>
                    </div>
                    <span className="font-mono text-xs text-gray-600">
                      {verification.voterProof.substring(0, 16)}...
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border-l-4 border-l-green-500">
                  <h4 className="font-semibold text-green-900 mb-2">Verification Details</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✓ Vote exists on the blockchain</li>
                    <li>✓ Transaction hash is valid</li>
                    <li>✓ Cryptographic proof verified</li>
                    <li>✓ Vote integrity confirmed</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information Card */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                About Vote Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  <strong>Blockchain Security:</strong> Every vote is recorded on an immutable blockchain, ensuring that
                  your vote cannot be altered or deleted.
                </p>
                <p>
                  <strong>Anonymous Verification:</strong> While you can verify your vote exists, the system maintains
                  complete anonymity regarding your voting choice.
                </p>
                <p>
                  <strong>Cryptographic Proof:</strong> The verification process uses advanced cryptography to confirm
                  vote authenticity without revealing sensitive information.
                </p>
                <p>
                  <strong>Transparency:</strong> This verification system ensures complete transparency in the electoral
                  process while maintaining voter privacy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
