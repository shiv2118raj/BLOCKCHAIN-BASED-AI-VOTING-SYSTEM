"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Users,
  Vote,
  BarChart3,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Hash,
  Eye,
  UserCheck,
} from "lucide-react"
import BlockchainStatus from "@/components/blockchain-status"

interface AdminStats {
  totalVoters: number
  verifiedVoters: number
  activeElections: number
  totalVotes: number
  blockchainBlocks: number
  systemStatus: "healthy" | "warning" | "error"
}

interface Election {
  id: string
  title: string
  status: "draft" | "active" | "completed"
  startDate: string
  endDate: string
  totalVotes: number
  totalCandidates: number
}

interface VoterRegistration {
  id: string
  voterID: string
  fullName: string
  status: "pending" | "verified" | "rejected"
  submittedAt: string
  aadhaarNumber: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalVoters: 1250000,
    verifiedVoters: 1180000,
    activeElections: 3,
    totalVotes: 850000,
    blockchainBlocks: 850001,
    systemStatus: "healthy",
  })

  const [elections, setElections] = useState<Election[]>([
    {
      id: "1",
      title: "Lok Sabha Elections 2024",
      status: "active",
      startDate: "2024-04-19",
      endDate: "2024-06-01",
      totalVotes: 450000,
      totalCandidates: 8000,
    },
    {
      id: "2",
      title: "Maharashtra Assembly Elections",
      status: "active",
      startDate: "2024-10-15",
      endDate: "2024-10-15",
      totalVotes: 0,
      totalCandidates: 4000,
    },
    {
      id: "3",
      title: "Delhi Municipal Corporation Elections",
      status: "draft",
      startDate: "2024-12-01",
      endDate: "2024-12-01",
      totalVotes: 0,
      totalCandidates: 1500,
    },
  ])

  const [pendingRegistrations, setPendingRegistrations] = useState<VoterRegistration[]>([
    {
      id: "1",
      voterID: "MH123456789",
      fullName: "Amit Sharma",
      status: "pending",
      submittedAt: "2024-01-15T10:30:00Z",
      aadhaarNumber: "1234****5678",
    },
    {
      id: "2",
      voterID: "DL987654321",
      fullName: "Priya Singh",
      status: "pending",
      submittedAt: "2024-01-15T11:45:00Z",
      aadhaarNumber: "9876****4321",
    },
    {
      id: "3",
      voterID: "UP456789123",
      fullName: "Rajesh Kumar",
      status: "pending",
      submittedAt: "2024-01-15T14:20:00Z",
      aadhaarNumber: "4567****9123",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "verified":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleVerifyVoter = (voterId: string, action: "approve" | "reject") => {
    setPendingRegistrations((prev) =>
      prev.map((voter) =>
        voter.id === voterId ? { ...voter, status: action === "approve" ? "verified" : "rejected" } : voter,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Election Administration</h1>
                <p className="text-sm text-gray-600">System Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Activity className="w-3 h-3 mr-1" />
                System Healthy
              </Badge>
              <Button variant="outline" onClick={() => (window.location.href = "/")}>
                Exit Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{stats.totalVoters.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Total Voters</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{stats.verifiedVoters.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Verified</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Vote className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{stats.activeElections}</p>
                <p className="text-xs text-gray-600">Active Elections</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">{stats.totalVotes.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Total Votes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Hash className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-indigo-600">{stats.blockchainBlocks.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Blockchain Blocks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">99.9%</p>
                <p className="text-xs text-gray-600">System Uptime</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="elections" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="elections">Elections</TabsTrigger>
              <TabsTrigger value="voters">Voter Management</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="system">System Monitor</TabsTrigger>
            </TabsList>

            {/* Elections Tab */}
            <TabsContent value="elections" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Election Management</h2>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Create New Election
                </Button>
              </div>

              <div className="grid gap-6">
                {elections.map((election) => (
                  <Card key={election.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{election.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {new Date(election.startDate).toLocaleDateString()} -{" "}
                            {new Date(election.endDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(election.status)}>
                          {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg font-bold text-gray-900">{election.totalCandidates}</p>
                          <p className="text-xs text-gray-600">Candidates</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-lg font-bold text-blue-600">{election.totalVotes.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Votes Cast</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-lg font-bold text-green-600">
                            {election.totalVotes > 0 ? ((election.totalVotes / 1000000) * 100).toFixed(1) : 0}%
                          </p>
                          <p className="text-xs text-gray-600">Turnout</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-lg font-bold text-purple-600">
                            {election.status === "active" ? "Live" : "Inactive"}
                          </p>
                          <p className="text-xs text-gray-600">Status</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Results
                        </Button>
                        {election.status === "draft" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Activate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Voters Tab */}
            <TabsContent value="voters" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Voter Management</h2>
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-transparent">
                    Export Voter List
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Bulk Verify
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Registrations</CardTitle>
                  <CardDescription>Voter registrations awaiting verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingRegistrations.map((voter) => (
                      <div key={voter.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="grid md:grid-cols-4 gap-4">
                            <div>
                              <p className="font-medium">{voter.fullName}</p>
                              <p className="text-sm text-gray-600">Voter ID: {voter.voterID}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Aadhaar</p>
                              <p className="font-mono text-sm">{voter.aadhaarNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Submitted</p>
                              <p className="text-sm">{new Date(voter.submittedAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <Badge className={getStatusColor(voter.status)}>
                                {voter.status.charAt(0).toUpperCase() + voter.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {voter.status === "pending" && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleVerifyVoter(voter.id, "approve")}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleVerifyVoter(voter.id, "reject")}
                            >
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blockchain Tab */}
            <TabsContent value="blockchain" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Blockchain Management</h2>

              <div className="grid lg:grid-cols-2 gap-6">
                <BlockchainStatus />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="w-5 h-5" />
                      Recent Transactions
                    </CardTitle>
                    <CardDescription>Latest blockchain transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
                          type: "Vote Cast",
                          timestamp: Date.now() - 300000,
                        },
                        {
                          hash: "0x9876543210fedcba0987654321fedcba09876543",
                          type: "Vote Cast",
                          timestamp: Date.now() - 600000,
                        },
                        {
                          hash: "0x456789abcdef123456789abcdef123456789abc",
                          type: "Vote Cast",
                          timestamp: Date.now() - 900000,
                        },
                      ].map((tx, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-mono text-xs text-gray-700">{tx.hash.substring(0, 20)}...</p>
                            <p className="text-sm font-medium">{tx.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Confirmed
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Analytics</CardTitle>
                  <CardDescription>Network performance and security metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">2.3s</p>
                      <p className="text-sm text-gray-600">Avg Block Time</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">100%</p>
                      <p className="text-sm text-gray-600">Chain Integrity</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Hash className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-600">4</p>
                      <p className="text-sm text-gray-600">Mining Difficulty</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-orange-600">1,250</p>
                      <p className="text-sm text-gray-600">TPS Capacity</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Monitor Tab */}
            <TabsContent value="system" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">System Monitor</h2>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Connection</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Healthy
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Blockchain Network</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Face Recognition API</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Authentication Service</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Running
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Security Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <p className="text-green-600 font-medium">No Security Issues</p>
                      <p className="text-sm text-gray-600">All systems are secure and functioning normally</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity Log</CardTitle>
                  <CardDescription>System events and administrative actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        action: "Voter registration approved",
                        user: "Admin User",
                        timestamp: Date.now() - 300000,
                        type: "success",
                      },
                      {
                        action: "New election created",
                        user: "Election Officer",
                        timestamp: Date.now() - 600000,
                        type: "info",
                      },
                      {
                        action: "Blockchain integrity verified",
                        user: "System",
                        timestamp: Date.now() - 900000,
                        type: "success",
                      },
                      {
                        action: "Database backup completed",
                        user: "System",
                        timestamp: Date.now() - 1200000,
                        type: "info",
                      },
                    ].map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {log.type === "success" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-blue-600" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{log.action}</p>
                            <p className="text-xs text-gray-600">by {log.user}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    ))}
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
