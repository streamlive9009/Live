"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Video, VideoOff, Mic, MicOff, Monitor, Camera, Settings, Zap, Square } from "lucide-react"

interface ModelStreamControlsProps {
  isLive: boolean
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  onToggleVideo: () => void
  onToggleAudio: () => void
  onGoLive: () => void
  onStopStream: () => void
}

export function ModelStreamControls({
  isLive,
  isVideoEnabled,
  isAudioEnabled,
  onToggleVideo,
  onToggleAudio,
  onGoLive,
  onStopStream,
}: ModelStreamControlsProps) {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Media Controls */}
          <div className="flex items-center space-x-4">
            <Button
              variant={isVideoEnabled ? "default" : "destructive"}
              size="lg"
              onClick={onToggleVideo}
              className="h-14 w-14 rounded-xl font-semibold shadow-lg"
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>

            <Button
              variant={isAudioEnabled ? "default" : "destructive"}
              size="lg"
              onClick={onToggleAudio}
              className="h-14 w-14 rounded-xl font-semibold shadow-lg"
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg font-semibold"
            >
              <Monitor className="w-6 h-6" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg font-semibold"
            >
              <Camera className="w-6 h-6" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg font-semibold"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>

          {/* Stream Control */}
          <div className="flex items-center space-x-4">
            {!isLive ? (
              <Button
                onClick={onGoLive}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-4 text-lg font-bold rounded-xl shadow-xl"
              >
                <Zap className="w-6 h-6 mr-3" />
                Go Live
              </Button>
            ) : (
              <Button
                onClick={onStopStream}
                variant="destructive"
                size="lg"
                className="px-10 py-4 text-lg font-bold rounded-xl shadow-xl"
              >
                <Square className="w-6 h-6 mr-3" />
                End Stream
              </Button>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm font-medium text-gray-600">
            <div className="flex items-center space-x-6">
              <span className={`flex items-center ${isVideoEnabled ? "text-green-600" : "text-red-600"}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${isVideoEnabled ? "bg-green-500" : "bg-red-500"}`}></div>
                Camera {isVideoEnabled ? "On" : "Off"}
              </span>
              <span className={`flex items-center ${isAudioEnabled ? "text-green-600" : "text-red-600"}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${isAudioEnabled ? "bg-green-500" : "bg-red-500"}`}></div>
                Microphone {isAudioEnabled ? "On" : "Off"}
              </span>
            </div>
            <div className="text-gray-500 font-semibold">
              {isLive ? "Broadcasting to main-live-stream" : "Ready to broadcast"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
