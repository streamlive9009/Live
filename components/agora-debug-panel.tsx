"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AGORA_CONFIG } from "@/lib/agora-config"
import { Settings, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function AgoraDebugPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const [debugInfo, setDebugInfo] = useState({
    appId: AGORA_CONFIG.appId,
    channel: AGORA_CONFIG.channel,
    isConfigured: false,
    browserSupport: false,
    permissions: {
      camera: "unknown",
      microphone: "unknown",
    },
  })

  useEffect(() => {
    checkConfiguration()
    checkBrowserSupport()
    checkPermissions()
  }, [])

  const checkConfiguration = () => {
    const isConfigured = AGORA_CONFIG.appId && AGORA_CONFIG.appId !== "your-agora-app-id" && AGORA_CONFIG.appId !== ""
    setDebugInfo((prev) => ({ ...prev, isConfigured }))
  }

  const checkBrowserSupport = () => {
    const browserSupport = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    setDebugInfo((prev) => ({ ...prev, browserSupport }))
  }

  const checkPermissions = async () => {
    try {
      const cameraPermission = await navigator.permissions.query({ name: "camera" as PermissionName })
      const microphonePermission = await navigator.permissions.query({ name: "microphone" as PermissionName })

      setDebugInfo((prev) => ({
        ...prev,
        permissions: {
          camera: cameraPermission.state,
          microphone: microphonePermission.state,
        },
      }))
    } catch (error) {
      console.log("Permission check not supported in this browser")
    }
  }

  const testMediaAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      stream.getTracks().forEach((track) => track.stop())
      alert("✅ Camera and microphone access successful!")
      checkPermissions()
    } catch (error) {
      alert("❌ Failed to access camera/microphone: " + (error as Error).message)
    }
  }

  const getStatusIcon = (status: boolean | string) => {
    if (status === true || status === "granted") {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    } else if (status === false || status === "denied") {
      return <XCircle className="w-4 h-4 text-red-500" />
    } else {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-white shadow-lg"
      >
        <Settings className="w-4 h-4 mr-2" />
        Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Agora Debug Panel</CardTitle>
          <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm">
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>App ID Configured</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(debugInfo.isConfigured)}
              <Badge variant={debugInfo.isConfigured ? "default" : "destructive"}>
                {debugInfo.isConfigured ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Browser Support</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(debugInfo.browserSupport)}
              <Badge variant={debugInfo.browserSupport ? "default" : "destructive"}>
                {debugInfo.browserSupport ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Camera Permission</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(debugInfo.permissions.camera)}
              <Badge
                variant={
                  debugInfo.permissions.camera === "granted"
                    ? "default"
                    : debugInfo.permissions.camera === "denied"
                      ? "destructive"
                      : "secondary"
                }
              >
                {debugInfo.permissions.camera}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Microphone Permission</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(debugInfo.permissions.microphone)}
              <Badge
                variant={
                  debugInfo.permissions.microphone === "granted"
                    ? "default"
                    : debugInfo.permissions.microphone === "denied"
                      ? "destructive"
                      : "secondary"
                }
              >
                {debugInfo.permissions.microphone}
              </Badge>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t space-y-2">
          <div className="text-xs text-gray-600">
            <div>App ID: {debugInfo.appId || "Not set"}</div>
            <div>Channel: {debugInfo.channel}</div>
          </div>

          <Button onClick={testMediaAccess} size="sm" className="w-full">
            Test Camera & Mic
          </Button>
        </div>

        {!debugInfo.isConfigured && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <strong>Setup Required:</strong>
            <br />
            Add NEXT_PUBLIC_AGORA_APP_ID to your environment variables
          </div>
        )}
      </CardContent>
    </Card>
  )
}
