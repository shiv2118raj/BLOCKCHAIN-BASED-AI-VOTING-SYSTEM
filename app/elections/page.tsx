import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function ElectionsPage() {
  // Mock election data - in real app, this would come from database
  const elections = [
    {
      id: "1",
      title: "Lok Sabha Elections 2024",
      description: "General Elections for the 18th Lok Sabha of India",
      type: "General Election",
      startDate: "2024-04-19",
      endDate: "2024-06-01",
      status: "upcoming",
      constituency: "All India",
      totalCandidates: 8000,
    },
    {
      id: "2",
      title: "Maharashtra Assembly Elections",
      description: "State Assembly Elections for Maharashtra",
      type: "State Election",
      startDate: "2024-10-15",
      endDate: "2024-10-15",
      status: "upcoming",
      constituency: "Maharashtra",
      totalCandidates: 4000,
    },
    {
      id: "3",
      title: "Delhi Municipal Corporation Elections",
      description: "Local body elections for Delhi MCD",
      type: "Local Election",
      startDate: "2024-12-01",
      endDate: "2024-12-01",
      status: "upcoming",
      constituency: "Delhi",
      totalCandidates: 1500,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Elections</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="outline">Login to Vote</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Elections List */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Current & Upcoming Elections</h1>
            <p className="text-gray-600">Participate in democratic process through secure blockchain voting</p>
          </div>

          <div className="space-y-6">
            {elections.map((election) => (
              <Card key={election.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{election.title}</CardTitle>
                      <CardDescription className="text-base">{election.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(election.status)}>
                      {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div className="text-sm">
                        <p className="font-medium">Start Date</p>
                        <p className="text-gray-600">{new Date(election.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div className="text-sm">
                        <p className="font-medium">End Date</p>
                        <p className="text-gray-600">{new Date(election.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div className="text-sm">
                        <p className="font-medium">Constituency</p>
                        <p className="text-gray-600">{election.constituency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div className="text-sm">
                        <p className="font-medium">Candidates</p>
                        <p className="text-gray-600">{election.totalCandidates.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={`/elections/${election.id}`}>
                      <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                        View Details
                      </Button>
                    </Link>
                    {election.status === "active" && (
                      <Link href={`/vote/${election.id}`}>
                        <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                          Vote Now
                        </Button>
                      </Link>
                    )}
                    {election.status === "upcoming" && (
                      <Button disabled className="w-full sm:w-auto">
                        Voting Opens Soon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
