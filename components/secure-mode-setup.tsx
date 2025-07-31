"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Copy, CheckCircle, ExternalLink, AlertTriangle } from "lucide-react"

export function SecureModeSetup() {
  const [copied, setCopied] = useState(false)
  const [appCertificate, setAppCertificate] = useState("")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const steps = [
    {
      title: "Switch to Secure Mode",
      description: "Enable certificate authentication in Agora Console",
      status: "required",
    },
    {
      title: "Get App Certificate",
      description: "Copy your App Certificate from Agora Console",
      status: "required",
    },
    {
      title: "Set Environment Variables",
      description: "Add App Certificate to your environment",
      status: "required",
    },
    {
      title: "Deploy & Test",
      description: "Deploy and verify token authentication works",
      status: "required",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-green-600" />
            <span>Upgrade to Secure Mode</span>
            <Badge className="bg-green-100 text-green-800">Production Ready</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Shield className="w-4 h-4" />
            <AlertDescription>
              <strong>Secure Mode</strong> provides enterprise-grade security with token-based authentication. This
              prevents unauthorized access to your Agora channels and is required for production applications.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {step.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Switch to Secure Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 1: Enable Secure Mode in Agora Console</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-3 text-sm">
            <li>
              Go to{" "}
              <a
                href="https://console.agora.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium inline-flex items-center"
              >
                Agora Console
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </li>
            <li>Select your existing project or create a new one</li>
            <li>
              Go to <strong>Project Settings</strong>
            </li>
            <li>
              Find the <strong>Authentication</strong> section
            </li>
            <li>
              Switch from <strong>"Testing Mode"</strong> to <strong>"Secure Mode"</strong>
            </li>
            <li>Confirm the change (this will generate an App Certificate)</li>
          </ol>

          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <strong>Important:</strong> Once you switch to Secure Mode, your existing Testing Mode App ID will stop
              working until you implement token authentication.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Step 2: Get App Certificate */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 2: Copy Your App Certificate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            After enabling Secure Mode, you'll see an App Certificate in your project settings.
          </p>

          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              In your Agora project settings, find the <strong>App Certificate</strong>
            </li>
            <li>
              Click the <strong>"Copy"</strong> button next to the certificate
            </li>
            <li>Keep this certificate secure - it's like a password for your project</li>
          </ol>

          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Security Note:</strong> Never expose your App Certificate in client-side code. It should only be
              used on your server for token generation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 3: Set Environment Variables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Add your App Certificate to your environment variables. This enables server-side token generation.
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="appCertificate" className="text-sm font-medium">
                App Certificate (paste here to generate environment variable)
              </Label>
              <Input
                id="appCertificate"
                type="password"
                placeholder="Paste your App Certificate here"
                value={appCertificate}
                onChange={(e) => setAppCertificate(e.target.value)}
                className="mt-1"
              />
            </div>

            {appCertificate && (
              <div className="space-y-3">
                <h4 className="font-medium">Add to Vercel Dashboard:</h4>
                <div className="relative">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
                    <div>AGORA_APP_CERTIFICATE={appCertificate}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-8 w-8 p-0"
                    onClick={() => copyToClipboard(`AGORA_APP_CERTIFICATE=${appCertificate}`)}
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
                    <li>
                      Add new variable: <code>AGORA_APP_CERTIFICATE</code>
                    </li>
                    <li>Paste the value above</li>
                    <li>
                      Set environment to <strong>Production</strong>
                    </li>
                    <li>Click Save</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Deploy & Test */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 4: Deploy & Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            After setting the environment variables, deploy your application and test the secure authentication.
          </p>

          <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
            <div># Deploy to production</div>
            <div>vercel --prod</div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Testing Checklist:</h4>
            <div className="space-y-2">
              {[
                "Live streaming starts without authentication errors",
                "Tokens are generated automatically",
                "Multiple viewers can join simultaneously",
                "Token refresh works automatically",
                "No console errors related to authentication",
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-4 h-4 border border-gray-300 rounded"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Alert>
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              <strong>Success!</strong> Your live streaming platform now uses enterprise-grade security with automatic
              token management and refresh.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Benefits of Secure Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Enhanced Security",
                description: "Prevents unauthorized access to your channels",
                icon: "🔒",
              },
              {
                title: "Production Ready",
                description: "Meets enterprise security requirements",
                icon: "🏢",
              },
              {
                title: "Automatic Token Management",
                description: "Handles token generation and refresh automatically",
                icon: "⚡",
              },
              {
                title: "Scalable Architecture",
                description: "Supports thousands of concurrent users securely",
                icon: "📈",
              },
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="text-2xl">{benefit.icon}</div>
                <div>
                  <h4 className="font-medium text-green-800">{benefit.title}</h4>
                  <p className="text-sm text-green-700">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
