"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize, Users, Video, Wifi, WifiOff, AlertCircle } from "lucide-react"
import { useAgoraClient } from "@/hooks/use-agora-client"
import { STREAM_STATUS, isAgoraConfigured } from "@/lib/agora-config"
import { AgoraSetupGuide } from "@/components/agora-setup-guide"
import { AgoraErrorHandler } from "@/components/agora-error-handler"

interface User {
  fullName: string
  phoneNumber: string
}

interface LiveStreamViewerProps {
  user: User
}

export function LiveStreamViewer({ user }: LiveStreamViewerProps) {
  const videoRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [hasTriedToPlay, setHasTriedToPlay] = useState(false)
  const [initializationAttempted, setInitializationAttempted] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const { remoteUsers, isJoined, streamStatus, isClientReady, configError, join, leave } = useAgoraClient({
    role: "audience",
    onUserJoined: (uid) => {
      console.log("Broadcaster joined:", uid)
      setViewerCount((prev) => prev + 1)
    },
    onUserLeft: (uid) => {
      console.log("Broadcaster left:", uid)
      setViewerCount((prev) => Math.max(0, prev - 1))
    },
    onStreamStatusChange: (status) => {
      console.log("Stream status changed:", status)
      if (status === STREAM_STATUS.LIVE) {
        setIsPlaying(true)
        setConnectionError(null) // Clear error on success
      } else if (status === STREAM_STATUS.OFFLINE) {
        setIsPlaying(false)
      }
    },
  })

  useEffect(() => {
    let mounted = true

    const initializeViewer = async () => {
      if (!isClientReady) {
        console.log("Waiting for Agora client to be ready...")
        return
      }

      if (initializationAttempted) {
        console.log("Initialization already attempted")
        return
      }

      try {
        console.log("Initializing viewer and joining channel...")
        setInitializationAttempted(true)
        setConnectionError(null) // Clear any previous errors

        if (mounted) {
          await join()
        }
      } catch (error) {
        console.error("Failed to initialize viewer:", error)
        setInitializationAttempted(false)

        // Set connection error for display
        if (error instanceof Error) {
          setConnectionError(error.message)
        } else {
          setConnectionError("Failed to connect to Agora servers")
        }
      }
    }

    if (isClientReady && !initializationAttempted) {
      initializeViewer()
    }

    return () => {
      mounted = false
      if (isJoined) {
        leave()
      }
    }
  }, [isClientReady, initializationAttempted, join, leave, isJoined])

  useEffect(() => {
    if (videoRef.current && remoteUsers.size > 0) {
      const remoteUser = Array.from(remoteUsers.values())[0]
      if (remoteUser.videoTrack && !hasTriedToPlay) {
        try {
          console.log("Playing remote video track")
          remoteUser.videoTrack.play(videoRef.current)
          setIsPlaying(true)
          setHasTriedToPlay(true)
        } catch (error) {
          console.error("Failed to play remote video:", error)
        }
      }
    }
  }, [remoteUsers, hasTriedToPlay])

  const togglePlay = () => {
    toggleMute()
  }

  const toggleMute = () => {
    if (remoteUsers.size > 0) {
      const remoteUser = Array.from(remoteUsers.values())[0]
      if (remoteUser.audioTrack) {
        if (isMuted) {
          remoteUser.audioTrack.setVolume(100)
        } else {
          remoteUser.audioTrack.setVolume(0)
        }
        setIsMuted(!isMuted)
      }
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const getStatusColor = () => {
    switch (streamStatus) {
      case STREAM_STATUS.LIVE:
        return "bg-red-500"
      case STREAM_STATUS.CONNECTING:
        return "bg-yellow-500"
      case STREAM_STATUS.OFFLINE:
        return "bg-gray-500"
      case STREAM_STATUS.ERROR:
        return "bg-red-600"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    switch (streamStatus) {
      case STREAM_STATUS.LIVE:
        return "LIVE"
      case STREAM_STATUS.CONNECTING:
        return "CONNECTING"
      case STREAM_STATUS.OFFLINE:
        return "OFFLINE"
      case STREAM_STATUS.ERROR:
        return "ERROR"
      default:
        return "OFFLINE"
    }
  }

  const isLoading = streamStatus === STREAM_STATUS.CONNECTING || !isClientReady
  const hasRemoteVideo = remoteUsers.size > 0 && Array.from(remoteUsers.values())[0]?.videoTrack
  const isLive = streamStatus === STREAM_STATUS.LIVE && hasRemoteVideo
  const hasError = streamStatus === STREAM_STATUS.ERROR || configError

  if (connectionError) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6" style={{ height: "85vh" }}>
        <AgoraErrorHandler
          error={connectionError}
          onRetry={() => {
            setConnectionError(null)
            setInitializationAttempted(false)
          }}
        />
      </div>
    )
  }

  if (!isAgoraConfigured()) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg" style={{ height: "85vh" }}>
        <div className="p-8">
          <AgoraSetupGuide />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div
        className="w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded-lg"
        style={{ height: "85vh" }}
      >
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-6"></div>
          <p className="text-xl font-semibold mb-2">
            {!isClientReady ? "Initializing Agora client..." : "Connecting to live stream..."}
          </p>
          <p className="text-sm text-gray-300 font-medium">
            Client Ready: {isClientReady ? "Yes" : "No"} | Status: {getStatusText()}
          </p>
          {configError && <p className="text-xs text-red-400 mt-3 font-medium">{configError}</p>}
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full bg-gradient-to-br from-gray-800 to-gray-900 group rounded-lg overflow-hidden"
      style={{ height: "85vh" }}
    >
      <div
        ref={videoRef}
        className="w-full h-full"
        style={{ background: hasRemoteVideo ? "transparent" : "#1f2937" }}
      />

      {/* Stream Status Overlay */}
      <div className="absolute top-6 left-6 flex items-center space-x-3">
        <div
          className={`${getStatusColor()} text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg backdrop-blur-sm`}
        >
          <div
            className={`w-3 h-3 bg-white rounded-full ${streamStatus === STREAM_STATUS.LIVE ? "animate-pulse" : ""}`}
          ></div>
          <span>{getStatusText()}</span>
        </div>
        {isLive && (
          <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{viewerCount}</span>
          </div>
        )}
      </div>

      {/* Connection Status */}
      <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-sm rounded-full p-3">
        {isJoined ? <Wifi className="w-6 h-6 text-green-400" /> : <WifiOff className="w-6 h-6 text-red-400" />}
      </div>

      {/* Controls Overlay */}
      {isLive && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20 font-semibold"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20 font-semibold"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20 font-semibold"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* No Stream Message */}
      {!hasRemoteVideo && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50">
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              {hasError ? <AlertCircle className="w-12 h-12 text-white" /> : <Video className="w-12 h-12 text-white" />}
            </div>
            <p className="text-3xl font-bold mb-4">
              {hasError ? "Configuration Error" : "Stream is currently offline"}
            </p>
            <p className="text-lg text-gray-300 font-medium">
              {hasError
                ? "Please configure Agora App ID to enable streaming"
                : "The broadcaster will appear here when they go live"}
            </p>
            {configError && <p className="text-sm text-red-400 mt-4 font-medium">{configError}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
