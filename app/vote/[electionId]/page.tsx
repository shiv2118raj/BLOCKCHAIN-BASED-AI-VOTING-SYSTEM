"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Vote, Shield, Calendar, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import FaceRecognition from "@/components/face-recognition"
import BlockchainStatus from "@/components/blockchain-status"

interface Candidate {
  id: string
  candidate_name: string
  party_name: string
  party_symbol: string
  manifesto: string
}

interface Election {
  id: string
  title: string
  description: string
  election_type: string
  start_date: string
  end_date: string
}

export default function VotePage({ params }: { params: Promise<{ electionId: string }> }) {
  // Unwrap the params Promise using React.use()
  const { electionId } = use(params)
  
  const [election, setElection] = useState<Election | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [currentStep, setCurrentStep] = useState<"selection" | "verification" | "casting" | "success">("selection")
  const [faceVerificationData, setFaceVerificationData] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [voteResult, setVoteResult] = useState<any>(null)
  const [voterID, setVoterID] = useState<string>("")
  const [storedFaceData, setStoredFaceData] = useState<string>("")
  const router = useRouter()

  // Get voter data from sessionStorage and fetch face data
  useEffect(() => {
    const voterDataStr = sessionStorage.getItem("voterData")
    let currentVoterID = ""
    
    if (voterDataStr) {
      try {
        const voterData = JSON.parse(voterDataStr)
        currentVoterID = voterData.voter_id || ""
        setVoterID(currentVoterID)
      } catch (e) {
        console.error("[v0] Error parsing voter data:", e)
      }
    }

    // Fetch stored face data if voter ID is available
    const fetchFaceData = async () => {
      if (currentVoterID) {
        try {
          const { createClient } = await import("@/lib/supabase/client")
          const supabase = createClient()
          const { data: voter, error: dbError } = await supabase
            .from("voters")
            .select("face_encoding")
            .eq("voter_id", currentVoterID)
            .single()

          if (!dbError && voter?.face_encoding) {
            setStoredFaceData(voter.face_encoding)
          } else {
            console.log("[v0] No face data found for voter:", currentVoterID)
          }
        } catch (e) {
          console.error("[v0] Error fetching face data:", e)
        }
      }
    }

    if (currentVoterID) {
      fetchFaceData()
    }
  }, [])

  useEffect(() => {
    fetchElectionData()
  }, [electionId])

  const fetchElectionData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Mock election data - in real app, this would come from API
      const mockElection: Election = {
        id: electionId,
        title: "Lok Sabha Elections 2024",
        description: "General Elections for the 18th Lok Sabha of India",
        election_type: "general",
        start_date: "2024-04-19",
        end_date: "2024-06-01",
      }

      const mockCandidates: Candidate[] = [
        {
          id: "1",
          candidate_name: "Rajesh Kumar",
          party_name: "Bharatiya Janata Party",
          party_symbol: "/placeholder-jv1mn.png",
          manifesto: "Development and progress for all citizens with focus on digital India and economic growth.",
        },
        {
          id: "2",
          candidate_name: "Priya Sharma",
          party_name: "Indian National Congress",
          party_symbol: "/placeholder-ini6z.png",
          manifesto: "Social justice and inclusive growth with emphasis on employment and healthcare.",
        },
        {
          id: "3",
          candidate_name: "Amit Singh",
          party_name: "Aam Aadmi Party",
          party_symbol: "/placeholder-nwtxe.png",
          manifesto: "Clean governance and transparency with focus on education and anti-corruption.",
        },
        {
          id: "4",
          candidate_name: "Sunita Devi",
          party_name: "Bahujan Samaj Party",
          party_symbol: "/placeholder-u9cmw.png",
          manifesto: "Empowerment of marginalized communities and social equality for all.",
        },
        {
          id: "5",
          candidate_name: "Mohammed Ali",
          party_name: "Samajwadi Party",
          party_symbol: "/placeholder-l8wn6.png",
          manifesto: "Socialist policies and development with focus on farmers and workers.",
        },
      ]

      setElection(mockElection)
      setCandidates(mockCandidates)
    } catch (error) {
      setError("Failed to load election data")
      console.error("[v0] Election data fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCandidateSelection = () => {
    if (!selectedCandidate) {
      setError("Please select a candidate")
      return
    }
    setError(null)
    setCurrentStep("verification")
  }

  const handleFaceVerificationSuccess = (faceData: string) => {
    setFaceVerificationData(faceData)
    setCurrentStep("casting")
    castVote()
  }

  const handleFaceVerificationError = (error: string) => {
    setError(error)
    setCurrentStep("selection")
  }

  const castVote = async () => {
    try {
      setError(null)

      const response = await fetch("/api/vote/cast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateId: selectedCandidate,
          electionId: electionId,
          faceVerificationData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setVoteResult(data)
        setCurrentStep("success")
        console.log("[v0] Vote cast successfully:", data)
      } else {
        setError(data.error || "Failed to cast vote")
        setCurrentStep("selection")
      }
    } catch (error) {
      setError("Network error occurred")
      setCurrentStep("selection")
      console.error("[v0] Vote casting error:", error)
    }
  }

  const getSelectedCandidateName = () => {
    const candidate = candidates.find((c) => c.id === selectedCandidate)
    return candidate ? `${candidate.candidate_name} (${candidate.party_name})` : ""
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading election data...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <CardTitle className="text-red-600">Election Not Found</CardTitle>
            <CardDescription>The requested election could not be found or is not active.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/elections">
              <Button>View All Elections</Button>
            </Link>
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Secure Voting</h1>
                <p className="text-sm text-gray-600">{election.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                Blockchain Secured
              </Badge>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Election Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {election.title}
              </CardTitle>
              <CardDescription>{election.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>Type: {election.election_type}</span>
                <span>Ends: {new Date(election.end_date).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Candidate Selection Step */}
              {currentStep === "selection" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Your Candidate</CardTitle>
                    <CardDescription>Choose the candidate you want to vote for in this election</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                      {candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <RadioGroupItem value={candidate.id} id={candidate.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={candidate.id} className="cursor-pointer">
                              <div className="flex items-start gap-4">
                                <img
                                  src={candidate.party_symbol || "/placeholder.svg"}
                                  alt={`${candidate.party_name} symbol`}
                                  className="w-16 h-16 object-contain"
                                />
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{candidate.candidate_name}</h3>
                                  <p className="text-blue-600 font-medium">{candidate.party_name}</p>
                                  <p className="text-sm text-gray-600 mt-2">{candidate.manifesto}</p>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleCandidateSelection}
                      className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
                      disabled={!selectedCandidate}
                    >
                      Proceed to Verification
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Face Verification Step */}
              {currentStep === "verification" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Confirm Your Selection</CardTitle>
                      <CardDescription>You have selected: {getSelectedCandidateName()}</CardDescription>
                    </CardHeader>
                  </Card>

                  <FaceRecognition
                    onSuccess={handleFaceVerificationSuccess}
                    onError={handleFaceVerificationError}
                    title="Verify Your Identity"
                    description="Complete face verification to cast your vote securely"
                    voterID={voterID}
                    storedFaceData={storedFaceData}
                    enableRealTimeVerification={true}
                    similarityThreshold={30}
                  />

                  <div className="text-center">
                    <Button onClick={() => setCurrentStep("selection")} variant="outline" className="bg-transparent">
                      Change Selection
                    </Button>
                  </div>
                </div>
              )}

              {/* Vote Casting Step */}
              {currentStep === "casting" && (
                <Card>
                  <CardHeader className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
                    <CardTitle className="text-2xl">Casting Your Vote</CardTitle>
                    <CardDescription>
                      Your vote for {getSelectedCandidateName()} is being securely recorded on the blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-700">
                          Please wait while we encrypt your vote and add it to the blockchain. This process ensures
                          maximum security and anonymity.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Success Step */}
              {currentStep === "success" && (
                <Card>
                  <CardHeader className="text-center">
                    <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
                    <CardTitle className="text-3xl text-green-600">Vote Cast Successfully!</CardTitle>
                    <CardDescription className="text-lg">
                      Your vote has been securely recorded on the blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-green-50 p-6 rounded-lg space-y-4">
                      <div className="text-center">
                        <h3 className="font-semibold text-green-900 mb-2">Vote Confirmation</h3>
                        <p className="text-sm text-green-700">
                          Your vote for {getSelectedCandidateName()} has been successfully cast and verified.
                        </p>
                      </div>

                      {voteResult?.blockchainHash && (
                        <div className="border-t border-green-200 pt-4">
                          <p className="text-xs text-green-600 mb-2">Blockchain Transaction Hash:</p>
                          <p className="font-mono text-xs bg-white p-2 rounded border break-all">
                            {voteResult.blockchainHash}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-center space-y-4">
                      <p className="text-sm text-gray-600">
                        Your vote is now part of the immutable blockchain record. Thank you for participating in the
                        democratic process!
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/dashboard">
                          <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                            Return to Dashboard
                          </Button>
                        </Link>
                        <Link href="/elections">
                          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                            View Other Elections
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <BlockchainStatus />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Face Recognition</p>
                      <p className="text-xs text-gray-600">AI-powered biometric verification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Blockchain Security</p>
                      <p className="text-xs text-gray-600">Immutable vote recording</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Anonymous Voting</p>
                      <p className="text-xs text-gray-600">Your choice remains private</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Tamper Proof</p>
                      <p className="text-xs text-gray-600">Cryptographically secured</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Voting Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-xs">
                    <div
                      className={`flex items-center gap-2 ${currentStep === "selection" ? "text-blue-600 font-medium" : "text-gray-500"}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${currentStep === "selection" ? "bg-blue-600" : "bg-gray-300"}`}
                      />
                      Select Candidate
                    </div>
                    <div
                      className={`flex items-center gap-2 ${currentStep === "verification" ? "text-blue-600 font-medium" : "text-gray-500"}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${currentStep === "verification" ? "bg-blue-600" : "bg-gray-300"}`}
                      />
                      Face Verification
                    </div>
                    <div
                      className={`flex items-center gap-2 ${currentStep === "casting" ? "text-blue-600 font-medium" : "text-gray-500"}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${currentStep === "casting" ? "bg-blue-600" : "bg-gray-300"}`}
                      />
                      Blockchain Recording
                    </div>
                    <div
                      className={`flex items-center gap-2 ${currentStep === "success" ? "text-green-600 font-medium" : "text-gray-500"}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${currentStep === "success" ? "bg-green-600" : "bg-gray-300"}`}
                      />
                      Vote Confirmed
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
