"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { LiveStreamBroadcaster } from "@/components/live-stream-broadcaster"
import { ModelStreamControls } from "@/components/model-stream-controls"
import { IntegratedChatSection } from "@/components/integrated-chat-section"
import { Video, Clock, Eye, Heart, MessageCircle, DollarSign, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ModelPanel() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("modelAuth")
    localStorage.removeItem("modelToken")
    router.push("/model/auth/login")
  }

  const [isLive, setIsLive] = useState(false)
  const [streamTitle, setStreamTitle] = useState("Live with Sarah ✨")
  const [streamDescription, setStreamDescription] = useState("Come chat with me!")
  const [viewerCount, setViewerCount] = useState(0)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [streamDuration, setStreamDuration] = useState(0)
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [likes, setLikes] = useState(0)
  const [messages, setMessages] = useState(0)

  // Get model data
  const [modelData, setModelData] = useState({ fullName: "Model Sarah", phoneNumber: "+1234567890" })

  useEffect(() => {
    const savedModel = localStorage.getItem("modelAuth")
    if (savedModel) {
      const model = JSON.parse(savedModel)
      setModelData({ fullName: model.fullName, phoneNumber: model.phoneNumber })
    }
  }, [])

  // Stream duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLive) {
      interval = setInterval(() => {
        setStreamDuration((prev) => prev + 1)
      }, 1000)
    } else {
      setStreamDuration(0)
    }
    return () => clearInterval(interval)
  }, [isLive])

  const handleGoLive = async () => {
    if (!streamTitle.trim()) {
      alert("Please enter a stream title")
      return
    }

    try {
      setIsLive(true)
      setViewerCount(1) // Start with at least 1 viewer
      console.log("Going live with model panel...")
    } catch (error) {
      console.error("Failed to start stream:", error)
      setIsLive(false)
    }
  }

  const handleStopStream = () => {
    setIsLive(false)
    setViewerCount(0)
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
  }

  const handleViewerCountChange = (count: number) => {
    setViewerCount(count)
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
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
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Live Studio</h1>
                <p className="text-sm text-gray-600 font-medium">Welcome, {modelData.fullName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {isLive && (
                <div className="flex items-center space-x-4">
                  <Badge variant="destructive" className="animate-pulse font-semibold px-3 py-1">
                    🔴 LIVE
                  </Badge>
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Eye className="w-4 h-4" />
                    <span>{viewerCount}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm font-mono text-gray-700">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(streamDuration)}</span>
                  </div>
                </div>
              )}
              <Button variant="outline" size="sm" className="font-medium bg-transparent" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Main Streaming Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stream & Chat Combined Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Unified Stream & Chat Card */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-xl font-bold text-gray-900">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                    <span>{isLive ? "Live Stream & Chat" : "Stream Preview"}</span>
                  </div>
                  {isLive && (
                    <Badge variant="destructive" className="animate-pulse font-semibold">
                      Broadcasting
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Stream Section */}
                  <div className="lg:col-span-2">
                    <LiveStreamBroadcaster
                      isLive={isLive}
                      isVideoEnabled={isVideoEnabled}
                      isAudioEnabled={isAudioEnabled}
                      onViewerCountChange={handleViewerCountChange}
                    />
                  </div>

                  {/* Integrated Chat Section */}
                  <div className="lg:col-span-1 border-l border-gray-200">
                    <IntegratedChatSection user={modelData} isLive={isLive} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stream Controls */}
            <ModelStreamControls
              isLive={isLive}
              isVideoEnabled={isVideoEnabled}
              isAudioEnabled={isAudioEnabled}
              onToggleVideo={toggleVideo}
              onToggleAudio={toggleAudio}
              onGoLive={handleGoLive}
              onStopStream={handleStopStream}
            />
          </div>

          {/* Settings & Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stream Setup */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg font-bold text-gray-900">
                  <Settings className="w-5 h-5" />
                  <span>Stream Setup</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="streamTitle" className="text-sm font-semibold text-gray-700">
                    Stream Title
                  </Label>
                  <Input
                    id="streamTitle"
                    placeholder="Enter an engaging title"
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    disabled={isLive}
                    className="font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streamDescription" className="text-sm font-semibold text-gray-700">
                    Description
                  </Label>
                  <Textarea
                    id="streamDescription"
                    placeholder="Tell viewers what to expect"
                    value={streamDescription}
                    onChange={(e) => setStreamDescription(e.target.value)}
                    disabled={isLive}
                    rows={3}
                    className="font-medium"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Live Stats */}
            {isLive && (
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Live Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-center mb-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-700">{viewerCount}</div>
                      <div className="text-sm font-medium text-blue-600">Viewers</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                      <div className="flex items-center justify-center mb-2">
                        <Heart className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="text-2xl font-bold text-red-700">{likes}</div>
                      <div className="text-sm font-medium text-red-600">Likes</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                      <div className="flex items-center justify-center mb-2">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-700">{messages}</div>
                      <div className="text-sm font-medium text-green-600">Messages</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                      <div className="flex items-center justify-center mb-2">
                        <DollarSign className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="text-2xl font-bold text-yellow-700">${totalEarnings.toFixed(2)}</div>
                      <div className="text-sm font-medium text-yellow-600">Session</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
