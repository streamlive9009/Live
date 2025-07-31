"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Settings, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"
import { getAgoraDebugInfo } from "@/lib/agora-config"

export function AgoraSetupGuide() {
  const [copied, setCopied] = useState(false)
  const debugInfo = getAgoraDebugInfo()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Agora Configuration Issue</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            The current Agora App ID requires certificate authentication. This needs to be resolved for the streaming to
            work.
          </AlertDescription>
        </Alert>

        {/* Debug Information */}
        <div className="bg-red-50 p-3 rounded-md text-sm border border-red-200">
          <h4 className="font-semibold mb-2 text-red-800">Current Issue:</h4>
          <div className="space-y-1 font-mono text-xs text-red-700">
            <div>App ID: {debugInfo.appId}</div>
            <div>Certificate Mode: {debugInfo.certificateMode ? "✅ Enabled (Requires Token)" : "❌ Disabled"}</div>
            <div>Status: ❌ Authentication Required</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-red-800">🚨 Solutions (Choose One):</h3>

          <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              Option 1: Use Test App ID (Recommended for Development)
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
              <li>
                Go to{" "}
                <a href="https://console.agora.io" target="_blank" rel="noopener noreferrer" className="underline">
                  Agora Console
                </a>
              </li>
              <li>Create a new project</li>
              <li>
                <strong>Important:</strong> Choose "Testing Mode" (not "Secure Mode")
              </li>
              <li>Copy the App ID</li>
              <li>Update your environment variable</li>
            </ol>

            <div className="relative mt-3">
              <div className="bg-white p-3 rounded-md font-mono text-sm border">
                NEXT_PUBLIC_AGORA_APP_ID=your_new_test_app_id
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => copyToClipboard("NEXT_PUBLIC_AGORA_APP_ID=your_new_test_app_id")}
              >
                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Option 2: Implement Token Generation (Production)</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
              <li>
                Install Agora server SDK: <code className="bg-white px-1 rounded">npm install agora-access-token</code>
              </li>
              <li>Get your App Certificate from Agora Console</li>
              <li>Implement server-side token generation</li>
              <li>Add App Certificate to environment variables</li>
            </ol>
          </div>

          <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Option 3: Disable Certificate Authentication</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Go to your Agora project settings</li>
              <li>Switch from "Secure Mode" to "Testing Mode"</li>
              <li>This disables certificate requirements</li>
              <li>Redeploy your application</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 p-3 rounded-md">
            <p className="text-sm text-green-800">
              <strong>💡 Quick Fix:</strong> The easiest solution is to create a new Agora project in "Testing Mode" and
              use that App ID for development.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
