"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Vote, Shield, Users, BarChart3, Zap, Globe } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
                <h1 className="font-semibold text-gray-900">Blockchain Voting System</h1>
                <p className="text-sm text-gray-600">Secure • Transparent • Democratic</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/results">
                <Button variant="outline" className="bg-transparent">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Results
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="outline" className="bg-transparent">
                  Admin
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                  Voter Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800">
              <Shield className="w-3 h-3 mr-1" />
              Powered by Blockchain Technology
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
              The Future of Democratic Voting is Here
            </h1>
            <p className="text-xl text-gray-600 mb-8 text-pretty">
              Experience secure, transparent, and tamper-proof elections with our revolutionary blockchain-based voting
              system. Every vote is verified, encrypted, and permanently recorded on an immutable ledger.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Register to Vote
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="bg-transparent">
                  <Vote className="w-5 h-5 mr-2" />
                  Cast Your Vote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Blockchain Voting?</h2>
              <p className="text-gray-600 text-lg">
                Advanced technology ensuring the highest standards of electoral integrity
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Blockchain Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Every vote is cryptographically secured and stored on an immutable blockchain, making fraud
                    impossible.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Face Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    AI-powered biometric authentication ensures only verified voters can participate in elections.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Complete Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Real-time vote counting and public verification while maintaining voter privacy and anonymity.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Zap className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Instant Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Automated counting and instant result declaration eliminates delays and reduces human error.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 text-lg">Simple, secure, and transparent voting process</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Register</h3>
                <p className="text-sm text-gray-600">
                  Complete voter registration with Aadhaar verification and biometric enrollment
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Authenticate</h3>
                <p className="text-sm text-gray-600">
                  Login with face recognition and multi-factor authentication for secure access
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Vote</h3>
                <p className="text-sm text-gray-600">
                  Cast your encrypted vote which is immediately recorded on the blockchain
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="font-semibold mb-2">Verify</h3>
                <p className="text-sm text-gray-600">
                  Receive blockchain proof and verify your vote was counted correctly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Trusted by Millions</h2>
              <p className="text-blue-100 text-lg">Leading the digital transformation of democratic processes</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold mb-2">1.2M+</p>
                <p className="text-blue-100">Registered Voters</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">850K+</p>
                <p className="text-blue-100">Votes Cast</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">100%</p>
                <p className="text-blue-100">Blockchain Verified</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">99.9%</p>
                <p className="text-blue-100">System Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Experience the Future of Voting?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join millions of citizens who trust blockchain technology for secure, transparent elections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700"
                >
                  Get Started Today
                </Button>
              </Link>
              <Link href="/results">
                <Button size="lg" variant="outline" className="bg-transparent">
                  View Live Results
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Vote className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold">Blockchain Voting</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Revolutionizing democracy through secure, transparent, and tamper-proof blockchain technology.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">For Voters</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="/register" className="hover:text-white">
                      Register to Vote
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/login" className="hover:text-white">
                      Cast Your Vote
                    </Link>
                  </li>
                  <li>
                    <Link href="/vote/verify" className="hover:text-white">
                      Verify Your Vote
                    </Link>
                  </li>
                  <li>
                    <Link href="/results" className="hover:text-white">
                      View Results
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">For Officials</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="/admin/login" className="hover:text-white">
                      Admin Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="hover:text-white">
                      Election Management
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="hover:text-white">
                      Voter Verification
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin" className="hover:text-white">
                      System Monitor
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Technical Support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Security Reports
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 Blockchain Voting System. All rights reserved. | Secured by Advanced Cryptography</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
