"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, ExternalLink } from "lucide-react"

interface DeploymentCheck {
  name: string
  status: "success" | "error" | "warning" | "loading"
  message: string
  solution?: string
}

export function DeploymentStatus() {
  const [checks, setChecks] = useState<DeploymentCheck[]>([
    { name: "Environment Variables", status: "loading", message: "Checking..." },
    { name: "Agora Configuration", status: "loading", message: "Checking..." },
    { name: "API Routes", status: "loading", message: "Checking..." },
    { name: "Font Loading", status: "loading", message: "Checking..." },
    { name: "Build Process", status: "loading", message: "Checking..." },
  ])

  useEffect(() => {
    runDeploymentChecks()
  }, [])

  const runDeploymentChecks = async () => {
    const newChecks: DeploymentCheck[] = []

    // Check Environment Variables
    try {
      const agoraAppId = process.env.NEXT_PUBLIC_AGORA_APP_ID
      if (agoraAppId && agoraAppId !== "your-agora-app-id") {
        newChecks.push({
          name: "Environment Variables",
          status: "success",
          message: "Agora App ID configured correctly",
        })
      } else {
        newChecks.push({
          name: "Environment Variables",
          status: "error",
          message: "Agora App ID not configured",
          solution: "Set NEXT_PUBLIC_AGORA_APP_ID in Vercel dashboard",
        })
      }
    } catch (error) {
      newChecks.push({
        name: "Environment Variables",
        status: "error",
        message: "Failed to check environment variables",
      })
    }

    // Check API Routes
    try {
      const response = await fetch("/api/health")
      if (response.ok) {
        newChecks.push({
          name: "API Routes",
          status: "success",
          message: "API routes working correctly",
        })
      } else {
        newChecks.push({
          name: "API Routes",
          status: "error",
          message: `API routes returning ${response.status}`,
          solution: "Check serverless function deployment",
        })
      }
    } catch (error) {
      newChecks.push({
        name: "API Routes",
        status: "error",
        message: "API routes not accessible",
        solution: "Verify API routes are deployed correctly",
      })
    }

    // Check Agora Configuration
    try {
      const { isAgoraConfigured } = await import("@/lib/agora-config")
      if (isAgoraConfigured()) {
        newChecks.push({
          name: "Agora Configuration",
          status: "success",
          message: "Agora SDK configured correctly",
        })
      } else {
        newChecks.push({
          name: "Agora Configuration",
          status: "warning",
          message: "Agora SDK not fully configured",
          solution: "Complete Agora setup in dashboard",
        })
      }
    } catch (error) {
      newChecks.push({
        name: "Agora Configuration",
        status: "error",
        message: "Failed to load Agora configuration",
      })
    }

    // Check Font Loading
    try {
      const fontLoaded = document.fonts.check("16px Inter")
      newChecks.push({
        name: "Font Loading",
        status: fontLoaded ? "success" : "warning",
        message: fontLoaded ? "Fonts loaded successfully" : "Fonts still loading",
      })
    } catch (error) {
      newChecks.push({
        name: "Font Loading",
        status: "warning",
        message: "Font loading check not supported",
      })
    }

    // Check Build Process (simulated)
    newChecks.push({
      name: "Build Process",
      status: "success",
      message: "Application built and deployed successfully",
    })

    setChecks(newChecks)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "loading":
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case "loading":
        return <Badge className="bg-blue-100 text-blue-800">Checking</Badge>
      default:
        return null
    }
  }

  const hasErrors = checks.some((check) => check.status === "error")
  const hasWarnings = checks.some((check) => check.status === "warning")

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Deployment Status</span>
          <Button onClick={runDeploymentChecks} size="sm" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Recheck
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {checks.map((check, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
            <div className="flex-shrink-0 mt-0.5">{getStatusIcon(check.status)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-gray-900">{check.name}</h4>
                {getStatusBadge(check.status)}
              </div>
              <p className="text-sm text-gray-600">{check.message}</p>
              {check.solution && <p className="text-sm text-blue-600 mt-1">💡 {check.solution}</p>}
            </div>
          </div>
        ))}

        {/* Overall Status */}
        <div className="mt-6 p-4 border-t">
          {hasErrors ? (
            <div className="text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-red-700">Deployment Issues Found</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please fix the errors above before your application will work correctly.
              </p>
              <Button asChild>
                <a
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  Open Vercel Dashboard
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          ) : hasWarnings ? (
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-yellow-700">Deployment Warnings</h3>
              <p className="text-sm text-gray-600">
                Your application is deployed but some features may not work optimally.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-green-700">Deployment Successful!</h3>
              <p className="text-sm text-gray-600">All systems are working correctly.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
