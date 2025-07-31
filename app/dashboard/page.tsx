"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LiveStreamBroadcaster } from "@/components/live-stream-broadcaster"
import { Video, VideoOff, Mic, MicOff, Users, Settings } from "lucide-react"

export default function StreamerDashboard() {
  const [isLive, setIsLive] = useState(false)
  const [streamTitle, setStreamTitle] = useState("")
  const [streamDescription, setStreamDescription] = useState("")
  const [viewerCount, setViewerCount] = useState(0)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)

  const handleGoLive = async () => {
    if (!streamTitle.trim()) {
      alert("Please enter a stream title")
      return
    }

    try {
      setIsLive(true)
      console.log("Going live with Agora...")
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Video className="w-8 h-8 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">Streamer Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isLive && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-medium">LIVE</span>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{viewerCount}</span>
                  </div>
                </div>
              )}
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stream Setup / Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{isLive ? "Live Stream" : "Stream Preview"}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <LiveStreamBroadcaster
                  isLive={isLive}
                  isVideoEnabled={isVideoEnabled}
                  isAudioEnabled={isAudioEnabled}
                  onViewerCountChange={handleViewerCountChange}
                />

                {/* Stream Controls */}
                <div className="p-4 bg-gray-50 border-t">
                  <div className="flex items-center justify-center space-x-4">
                    <Button variant={isVideoEnabled ? "default" : "destructive"} size="sm" onClick={toggleVideo}>
                      {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                    <Button variant={isAudioEnabled ? "default" : "destructive"} size="sm" onClick={toggleAudio}>
                      {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                    {!isLive ? (
                      <Button onClick={handleGoLive} className="px-8">
                        Go Live
                      </Button>
                    ) : (
                      <Button onClick={handleStopStream} variant="destructive" className="px-8">
                        Stop Stream
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stream Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stream Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="streamTitle">Stream Title</Label>
                  <Input
                    id="streamTitle"
                    placeholder="Enter stream title"
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    disabled={isLive}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="streamDescription">Description</Label>
                  <Textarea
                    id="streamDescription"
                    placeholder="Describe your stream"
                    value={streamDescription}
                    onChange={(e) => setStreamDescription(e.target.value)}
                    disabled={isLive}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stream Stats */}
            {isLive && (
              <Card>
                <CardHeader>
                  <CardTitle>Live Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Viewers</span>
                      <span className="font-semibold">{viewerCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Duration</span>
                      <span className="font-semibold">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Quality</span>
                      <span className="font-semibold text-green-600">HD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Manage Followers
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Stream Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
