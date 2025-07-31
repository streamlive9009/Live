"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, RefreshCw, AlertTriangle } from "lucide-react"

interface AgoraErrorHandlerProps {
  error?: string
  onRetry?: () => void
}

export function AgoraErrorHandler({ error, onRetry }: AgoraErrorHandlerProps) {
  const [showSolution, setShowSolution] = useState(false)

  const isCertificateError = error?.includes("CAN_NOT_GET_GATEWAY_SERVER") || error?.includes("dynamic use static key")

  if (!error) return null

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-800">
          <AlertTriangle className="w-5 h-5" />
          <span>Agora Connection Error</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription className="text-red-700">
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>

        {isCertificateError && (
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">🚨 Certificate Authentication Required</h4>
              <p className="text-sm text-red-700 mb-3">
                Your Agora App ID is configured for "Secure Mode" which requires token-based authentication. This is
                common in production setups but needs additional configuration.
              </p>

              <Button
                onClick={() => setShowSolution(!showSolution)}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                {showSolution ? "Hide Solutions" : "Show Solutions"}
              </Button>
            </div>

            {showSolution && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">✅ Quick Fix (Recommended)</h5>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                    <li>
                      Go to{" "}
                      <a
                        href="https://console.agora.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-medium"
                      >
                        Agora Console
                      </a>
                    </li>
                    <li>Create a new project</li>
                    <li>
                      <strong>Select "Testing Mode"</strong> (not "Secure Mode")
                    </li>
                    <li>Copy the new App ID</li>
                    <li>Update NEXT_PUBLIC_AGORA_APP_ID in Vercel dashboard</li>
                    <li>Redeploy your application</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h5 className="font-semibold text-yellow-800 mb-2">🔧 Alternative: Switch to Testing Mode</h5>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                    <li>Go to your current Agora project settings</li>
                    <li>Switch from "Secure Mode" to "Testing Mode"</li>
                    <li>This disables certificate requirements</li>
                    <li>Redeploy your application</li>
                  </ol>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-2">🏭 Production Solution</h5>
                  <p className="text-sm text-green-700 mb-2">
                    For production apps, implement server-side token generation:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-green-700">
                    <li>
                      Install: <code className="bg-white px-1 rounded">npm install agora-access-token</code>
                    </li>
                    <li>Get App Certificate from Agora Console</li>
                    <li>Implement token generation in API route</li>
                    <li>Add AGORA_APP_CERTIFICATE environment variable</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-2">
          {onRetry && (
            <Button onClick={onRetry} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          )}
          <Button asChild size="sm">
            <a
              href="https://console.agora.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              Open Agora Console
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
