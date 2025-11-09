"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BarChart3, Search, Calendar, Vote, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"

interface ElectionSummary {
  id: string
  title: string
  status: "active" | "completed" | "upcoming"
  end_date: string
  total_votes: number
  turnout_percentage: number
  winner?: string
  winner_party?: string
}

export default function ResultsListPage() {
  const [elections, setElections] = useState<ElectionSummary[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchElections()
  }, [])

  const fetchElections = async () => {
    try {
      // Mock elections data
      const mockElections: ElectionSummary[] = [
        {
          id: "1",
          title: "Lok Sabha Elections 2024",
          status: "completed",
          end_date: "2024-06-01",
          total_votes: 642000000,
          turnout_percentage: 66.3,
          winner: "Narendra Modi",
          winner_party: "BJP",
        },
        {
          id: "2",
          title: "Maharashtra Assembly Elections 2024",
          status: "active",
          end_date: "2024-10-15",
          total_votes: 25000000,
          turnout_percentage: 45.2,
        },
        {
          id: "3",
          title: "Delhi Municipal Corporation Elections",
          status: "upcoming",
          end_date: "2024-12-01",
          total_votes: 0,
          turnout_percentage: 0,
        },
        {
          id: "4",
          title: "Karnataka Assembly Elections 2023",
          status: "completed",
          end_date: "2023-05-15",
          total_votes: 48000000,
          turnout_percentage: 73.2,
          winner: "Siddaramaiah",
          winner_party: "INC",
        },
      ]

      setElections(mockElections)
    } catch (error) {
      console.error("[v0] Elections fetch error:", error)
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
      case "upcoming":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Live Results"
      case "completed":
        return "Final Results"
      case "upcoming":
        return "Upcoming"
      default:
        return "Unknown"
    }
  }

  const filteredElections = elections.filter((election) =>
    election.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                <p className="text-sm text-gray-600">View results from all elections</p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Find Election Results</CardTitle>
              <CardDescription>Search and view results from current and past elections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search elections..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Elections List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p>Loading elections...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredElections.map((election) => (
                <Card key={election.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{election.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4" />
                          Election Date: {new Date(election.end_date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(election.status)}>{getStatusText(election.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Vote className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-blue-600">{election.total_votes.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Total Votes</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-green-600">{election.turnout_percentage}%</p>
                        <p className="text-xs text-gray-600">Turnout</p>
                      </div>
                      {election.winner && (
                        <>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <p className="text-lg font-bold text-yellow-600">{election.winner}</p>
                            <p className="text-xs text-gray-600">Winner</p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className="text-lg font-bold text-purple-600">{election.winner_party}</p>
                            <p className="text-xs text-gray-600">Winning Party</p>
                          </div>
                        </>
                      )}
                      {election.status === "active" && (
                        <div className="text-center p-3 bg-orange-50 rounded-lg col-span-2">
                          <p className="text-lg font-bold text-orange-600">Counting in Progress</p>
                          <p className="text-xs text-gray-600">Live Updates Available</p>
                        </div>
                      )}
                      {election.status === "upcoming" && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg col-span-2">
                          <p className="text-lg font-bold text-gray-600">Election Scheduled</p>
                          <p className="text-xs text-gray-600">Results will be available after voting</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {election.status !== "upcoming" && (
                        <Link href={`/results/${election.id}`} className="flex-1">
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                            <Eye className="w-4 h-4 mr-2" />
                            {election.status === "active" ? "View Live Results" : "View Final Results"}
                          </Button>
                        </Link>
                      )}
                      {election.status === "upcoming" && (
                        <Button disabled className="flex-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          Results Available After Election
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredElections.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No elections found matching your search.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
