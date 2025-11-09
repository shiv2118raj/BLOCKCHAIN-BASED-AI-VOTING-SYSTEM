"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, Vote, Calendar, Shield, RefreshCw, Download, Eye, Trophy } from "lucide-react"
import Link from "next/link"

interface Candidate {
  id: string
  candidate_name: string
  party_name: string
  party_symbol: string
  vote_count: number
  vote_percentage: number
  is_winner?: boolean
}

interface ElectionResult {
  id: string
  title: string
  description: string
  status: "active" | "completed" | "counting"
  start_date: string
  end_date: string
  total_votes: number
  total_eligible_voters: number
  turnout_percentage: number
  candidates: Candidate[]
  last_updated: string
}

interface ConstituencyResult {
  constituency: string
  total_votes: number
  leading_candidate: string
  leading_party: string
  margin: number
}

export default function ResultsPage({ params }: { params: { electionId: string } }) {
  const [results, setResults] = useState<ElectionResult | null>(null)
  const [constituencyResults, setConstituencyResults] = useState<ConstituencyResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchResults()

    if (autoRefresh) {
      const interval = setInterval(fetchResults, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [params.electionId, autoRefresh])

  const fetchResults = async () => {
    try {
      setIsLoading(true)

      // Mock election results data
      const mockResults: ElectionResult = {
        id: params.electionId,
        title: "Lok Sabha Elections 2024",
        description: "General Elections for the 18th Lok Sabha of India",
        status: "completed",
        start_date: "2024-04-19",
        end_date: "2024-06-01",
        total_votes: 642000000,
        total_eligible_voters: 968000000,
        turnout_percentage: 66.3,
        last_updated: new Date().toISOString(),
        candidates: [
          {
            id: "1",
            candidate_name: "Narendra Modi",
            party_name: "Bharatiya Janata Party",
            party_symbol: "/placeholder.svg?height=40&width=40&text=BJP",
            vote_count: 230000000,
            vote_percentage: 35.8,
            is_winner: true,
          },
          {
            id: "2",
            candidate_name: "Rahul Gandhi",
            party_name: "Indian National Congress",
            party_symbol: "/placeholder.svg?height=40&width=40&text=INC",
            vote_count: 180000000,
            vote_percentage: 28.0,
          },
          {
            id: "3",
            candidate_name: "Arvind Kejriwal",
            party_name: "Aam Aadmi Party",
            party_symbol: "/placeholder.svg?height=40&width=40&text=AAP",
            vote_count: 95000000,
            vote_percentage: 14.8,
          },
          {
            id: "4",
            candidate_name: "Mayawati",
            party_name: "Bahujan Samaj Party",
            party_symbol: "/placeholder.svg?height=40&width=40&text=BSP",
            vote_count: 70000000,
            vote_percentage: 10.9,
          },
          {
            id: "5",
            candidate_name: "Akhilesh Yadav",
            party_name: "Samajwadi Party",
            party_symbol: "/placeholder.svg?height=40&width=40&text=SP",
            vote_count: 67000000,
            vote_percentage: 10.4,
          },
        ],
      }

      const mockConstituencyResults: ConstituencyResult[] = [
        {
          constituency: "Mumbai North",
          total_votes: 1200000,
          leading_candidate: "Narendra Modi",
          leading_party: "BJP",
          margin: 150000,
        },
        {
          constituency: "Delhi Central",
          total_votes: 980000,
          leading_candidate: "Arvind Kejriwal",
          leading_party: "AAP",
          margin: 85000,
        },
        {
          constituency: "Kolkata South",
          total_votes: 1100000,
          leading_candidate: "Rahul Gandhi",
          leading_party: "INC",
          margin: 120000,
        },
      ]

      setResults(mockResults)
      setConstituencyResults(mockConstituencyResults)
    } catch (error) {
      console.error("[v0] Results fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "counting":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Voting in Progress"
      case "completed":
        return "Results Declared"
      case "counting":
        return "Counting in Progress"
      default:
        return "Unknown Status"
    }
  }

  if (isLoading && !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
            <span>Loading election results...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Results Not Available</CardTitle>
            <CardDescription>Election results could not be loaded</CardDescription>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Election Results</h1>
                <p className="text-sm text-gray-600">{results.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(results.status)}>{getStatusText(results.status)}</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchResults}
                disabled={isLoading}
                className="bg-transparent"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Election Overview */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{results.title}</CardTitle>
                  <CardDescription className="mt-2">{results.description}</CardDescription>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(results.start_date).toLocaleDateString()} -{" "}
                      {new Date(results.end_date).toLocaleDateString()}
                    </span>
                    <span>Last Updated: {new Date(results.last_updated).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Vote className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{results.total_votes.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Votes Cast</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{results.total_eligible_voters.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Eligible Voters</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{results.turnout_percentage}%</p>
                  <p className="text-sm text-gray-600">Voter Turnout</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">100%</p>
                  <p className="text-sm text-gray-600">Blockchain Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Results Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Results Overview</TabsTrigger>
              <TabsTrigger value="constituency">Constituency Wise</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Results Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6">
                {results.candidates
                  .sort((a, b) => b.vote_count - a.vote_count)
                  .map((candidate, index) => (
                    <Card
                      key={candidate.id}
                      className={candidate.is_winner ? "border-l-4 border-l-green-500 bg-green-50/30" : ""}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="relative">
                              <img
                                src={candidate.party_symbol || "/placeholder.svg"}
                                alt={`${candidate.party_name} symbol`}
                                className="w-16 h-16 object-contain"
                              />
                              {candidate.is_winner && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                  <Trophy className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold">{candidate.candidate_name}</h3>
                                {candidate.is_winner && (
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    <Trophy className="w-3 h-3 mr-1" />
                                    Winner
                                  </Badge>
                                )}
                                <Badge variant="outline" className="bg-transparent">
                                  #{index + 1}
                                </Badge>
                              </div>
                              <p className="text-blue-600 font-medium mb-3">{candidate.party_name}</p>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>Vote Share</span>
                                  <span className="font-semibold">{candidate.vote_percentage}%</span>
                                </div>
                                <Progress value={candidate.vote_percentage} className="h-3" />
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold text-gray-900">
                                {candidate.vote_count.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">votes</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Constituency Results Tab */}
            <TabsContent value="constituency" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Constituency-wise Results</CardTitle>
                  <CardDescription>Leading candidates in major constituencies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {constituencyResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{result.constituency}</h4>
                          <p className="text-sm text-gray-600">
                            Leading: {result.leading_candidate} ({result.leading_party})
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{result.total_votes.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Total Votes</p>
                        </div>
                        <div className="text-right ml-6">
                          <p className="font-bold text-lg text-green-600">+{result.margin.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Margin</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vote Distribution</CardTitle>
                    <CardDescription>Breakdown of votes by party</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.candidates.map((candidate) => (
                        <div key={candidate.id} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{candidate.party_name}</span>
                            <span>{candidate.vote_percentage}%</span>
                          </div>
                          <Progress value={candidate.vote_percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Turnout Analysis</CardTitle>
                    <CardDescription>Voter participation statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
                      <p className="text-4xl font-bold text-blue-600 mb-2">{results.turnout_percentage}%</p>
                      <p className="text-gray-600">Overall Turnout</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-xl font-bold">{results.total_votes.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Votes Cast</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-xl font-bold">
                          {(results.total_eligible_voters - results.total_votes).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Did Not Vote</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Verification</CardTitle>
                  <CardDescription>Vote integrity and security metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-xl font-bold text-green-600">100%</p>
                      <p className="text-sm text-gray-600">Votes Verified</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Vote className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-xl font-bold text-blue-600">{results.total_votes.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Blockchain Records</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-xl font-bold text-purple-600">0</p>
                      <p className="text-sm text-gray-600">Discrepancies</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-xl font-bold text-orange-600">99.99%</p>
                      <p className="text-sm text-gray-600">System Uptime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
