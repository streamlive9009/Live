"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LiveStreamViewer } from "@/components/live-stream-viewer"
import { AgoraDebugPanel } from "@/components/agora-debug-panel"
import { Video } from "lucide-react"
import { UnifiedChatSection } from "@/components/unified-chat-section"

interface User {
  fullName: string
  phoneNumber: string
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  })

  useEffect(() => {
    const savedUser = localStorage.getItem("streamUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      }

      setUser(newUser)
      localStorage.setItem("streamUser", JSON.stringify(newUser))
      setFormData({ fullName: "", phoneNumber: "" })
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsRegistering(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("streamUser")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Video className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">Join Live Stream</CardTitle>
            <p className="text-gray-600 font-medium">Enter your details to access the live stream and chat</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegistration} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  required
                  className="font-medium border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  required
                  className="font-medium border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-semibold py-3 rounded-lg shadow-lg"
                disabled={isRegistering}
              >
                {isRegistering ? "Joining..." : "Join Stream"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <AgoraDebugPanel />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">LiveStream</h1>
                <p className="text-sm text-gray-600 font-medium">Interactive Live Experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="font-medium bg-white/80 backdrop-blur-sm border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Unified Stream & Chat */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-xl font-bold text-gray-900">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>Live Stream & Chat</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                <span>Welcome, {user.fullName}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Live Stream Section - 2/3 width */}
              <div className="lg:col-span-2">
                <LiveStreamViewer user={user} />
              </div>

              {/* Live Chat Section - 1/3 width */}
              <div className="lg:col-span-1 border-l border-gray-200">
                <UnifiedChatSection user={user} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AgoraDebugPanel />
    </div>
  )
}
