"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Vote, User, Shield, Clock, CheckCircle, Calendar, Search } from "lucide-react"
import Link from "next/link"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      // Check if face verification passed (stored in sessionStorage)
      const faceVerified = sessionStorage.getItem("faceVerified")
      const voterDataStr = sessionStorage.getItem("voterData")
      
      if (faceVerified === "true" && voterDataStr) {
        console.log("[v0] Face verification confirmed, allowing dashboard access")
        try {
          const voterData = JSON.parse(voterDataStr)
          // Create a mock user object from voter data
          const mockUser = {
            id: voterData.voter_id,
            email: voterData.email,
            user_metadata: {
              full_name: voterData.full_name,
              voter_id: voterData.voter_id,
            },
          } as SupabaseUser
          setUser(mockUser)
          setLoading(false)
          return
        } catch (e) {
          console.error("[v0] Error parsing voter data:", e)
        }
      }

      // Check session first
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        console.log("[v0] Session found, user authenticated:", session.user.id)
        setUser(session.user)
        setLoading(false)
        return
      }

      // If no session, try to get user
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        // Only redirect if face verification didn't pass
        if (faceVerified !== "true") {
          console.log("[v0] No user and no face verification, redirecting to login")
        window.location.href = "/auth/login"
          return
        }
        
        // Face verified but no session - allow access
        console.log("[v0] No user found, but face verified - allowing access")
        if (voterDataStr) {
          try {
            const voterData = JSON.parse(voterDataStr)
            const mockUser = {
              id: voterData.voter_id,
              email: voterData.email,
              user_metadata: {
                full_name: voterData.full_name,
                voter_id: voterData.voter_id,
              },
            } as SupabaseUser
            setUser(mockUser)
          } catch (e) {
            setUser(null)
          }
        } else {
          setUser(null)
        }
        setLoading(false)
        return
      }

      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [supabase.auth])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const voterData = {
    voterID: "ABC123456789",
    fullName: user?.email?.split("@")[0] || "Rajesh Kumar",
    constituency: "Mumbai North",
    isVerified: true,
    votingHistory: [
      {
        election: "Lok Sabha Elections 2019",
        date: "2019-04-29",
        status: "voted",
        blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      },
      {
        election: "Maharashtra Assembly 2019",
        date: "2019-10-21",
        status: "voted",
        blockchainHash: "0x9876543210fedcba0987654321fedcba09876543",
      },
    ],
  }

  const currentElections = [
    {
      id: "1",
      title: "Lok Sabha Elections 2024",
      endDate: "2024-06-01",
      status: "active",
      hasVoted: false,
    },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Voter Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {voterData.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Voter Profile Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Voter Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Voter ID</p>
                  <p className="text-lg font-semibold">{voterData.voterID}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold">{voterData.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Constituency</p>
                  <p className="text-lg font-semibold">{voterData.constituency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Current Elections */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Active Elections</h2>
              {currentElections.map((election) => (
                <Card key={election.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{election.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4" />
                          Ends: {new Date(election.endDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {election.hasVoted ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Vote Cast Successfully</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-orange-600">
                          <Clock className="w-5 h-5" />
                          <span className="font-medium">Vote Pending</span>
                        </div>
                        <Link href={`/vote/${election.id}`}>
                          <Button className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                            <Vote className="w-4 h-4 mr-2" />
                            Cast Your Vote
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Vote Verification Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Verify Your Vote
                  </CardTitle>
                  <CardDescription>Check if your vote was successfully recorded on the blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/vote/verify">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Search className="w-4 h-4 mr-2" />
                      Verify Vote on Blockchain
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Voting History */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Voting History</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Previous Elections</CardTitle>
                  <CardDescription>Your participation in past elections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {voterData.votingHistory.map((vote, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{vote.election}</p>
                            <p className="text-sm text-gray-600">{new Date(vote.date).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Voted
                          </Badge>
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-xs text-gray-500 mb-1">Blockchain Hash:</p>
                          <p className="font-mono text-xs text-gray-700 break-all">{vote.blockchainHash}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Security Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Blockchain Security</h3>
                  <p className="text-sm text-gray-600">Your vote is secured using immutable blockchain technology</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Face Recognition</h3>
                  <p className="text-sm text-gray-600">AI-powered biometric authentication ensures vote integrity</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Anonymous Voting</h3>
                  <p className="text-sm text-gray-600">Your vote choice remains completely private and anonymous</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
