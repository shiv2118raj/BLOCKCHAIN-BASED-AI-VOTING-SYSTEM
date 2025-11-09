import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Shield, Mail } from "lucide-react"
import Link from "next/link"

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-3xl text-green-600">Registration Submitted!</CardTitle>
            <CardDescription className="text-lg">
              Your voter registration has been successfully submitted for verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900">Verification in Progress</h3>
                  <p className="text-sm text-blue-700">
                    Our AI system is processing your face recognition data and verifying your documents. This typically
                    takes 24-48 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-purple-900">Secure Processing</h3>
                  <p className="text-sm text-purple-700">
                    Your biometric data is encrypted and stored securely using advanced blockchain technology. Only you
                    can access your voting account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <Mail className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900">Email Confirmation</h3>
                  <p className="text-sm text-green-700">
                    You will receive an email confirmation once your registration is approved. Check your inbox and spam
                    folder regularly.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <h3 className="font-semibold text-gray-900">What happens next?</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>1. Document verification (24-48 hours)</p>
                <p>2. Face recognition model training</p>
                <p>3. Email confirmation with login credentials</p>
                <p>4. Ready to vote in upcoming elections!</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                  Return to Home
                </Button>
              </Link>
              <Link href="/elections">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                  View Elections
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
