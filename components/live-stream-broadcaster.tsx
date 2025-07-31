"use client"

import { useEffect, useRef, useState } from "react"
import { useAgoraClient } from "@/hooks/use-agora-client"
import { STREAM_STATUS, isAgoraConfigured } from "@/lib/agora-config"
import { Wifi, WifiOff, Video, VideoOff, AlertCircle } from "lucide-react"
import { AgoraSetupGuide } from "@/components/agora-setup-guide"
import { AgoraErrorHandler } from "@/components/agora-error-handler"

interface LiveStreamBroadcasterProps {
  isLive: boolean
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  onViewerCountChange?: (count: number) => void
  onStreamStatusChange?: (status: string) => void
}

export function LiveStreamBroadcaster({
  isLive,
  isVideoEnabled,
  isAudioEnabled,
  onViewerCountChange,
  onStreamStatusChange,
}: LiveStreamBroadcasterProps) {
  const videoRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [hasTriedToPlay, setHasTriedToPlay] = useState(false)
  const [initializationAttempted, setInitializationAttempted] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const {
    localVideoTrack,
    isJoined,
    isPublishing,
    streamStatus,
    isClientReady,
    configError,
    join,
    leave,
    startPublishing,
    stopPublishing,
    toggleVideo,
    toggleAudio,
  } = useAgoraClient({
    role: "host",
    onUserJoined: (uid) => {
      const newCount = viewerCount + 1
      setViewerCount(newCount)
      onViewerCountChange?.(newCount)
      console.log("Viewer joined:", uid, "Total viewers:", newCount)
    },
    onUserLeft: (uid) => {
      const newCount = Math.max(0, viewerCount - 1)
      setViewerCount(newCount)
      onViewerCountChange?.(newCount)
      console.log("Viewer left:", uid, "Total viewers:", newCount)
    },
    onStreamStatusChange: (status) => {
      onStreamStatusChange?.(status)
      console.log("Broadcast status changed:", status)

      // Clear connection error when status improves
      if (status === STREAM_STATUS.LIVE || status === STREAM_STATUS.CONNECTING) {
        setConnectionError(null)
      }
    },
  })

  useEffect(() => {
    let mounted = true

    const initializeBroadcast = async () => {
      if (!isClientReady) {
        console.log("Waiting for Agora client to be ready...")
        return
      }

      if (initializationAttempted) {
        console.log("Initialization already attempted")
        return
      }

      try {
        console.log("Initializing broadcast...")
        setInitializationAttempted(true)
        setConnectionError(null) // Clear any previous errors

        if (mounted) {
          await join()
          console.log("Joined channel, starting to publish...")
          await startPublishing()
          setIsInitialized(true)
          console.log("Broadcast initialized successfully")
        }
      } catch (error) {
        console.error("Failed to initialize broadcast:", error)
        if (mounted) {
          setIsInitialized(false)
          setInitializationAttempted(false)

          // Set connection error for display
          if (error instanceof Error) {
            setConnectionError(error.message)
          } else {
            setConnectionError("Failed to connect to Agora servers")
          }
        }
      }
    }

    const stopBroadcast = async () => {
      try {
        console.log("Stopping broadcast...")
        await stopPublishing()
        await leave()
        if (mounted) {
          setIsInitialized(false)
          setViewerCount(0)
          onViewerCountChange?.(0)
          setHasTriedToPlay(false)
          setInitializationAttempted(false)
        }
        console.log("Broadcast stopped")
      } catch (error) {
        console.error("Failed to stop broadcast:", error)
      }
    }

    if (isLive && !isInitialized && isClientReady && !initializationAttempted) {
      initializeBroadcast()
    } else if (!isLive && isInitialized) {
      stopBroadcast()
    }

    return () => {
      mounted = false
    }
  }, [
    isLive,
    isInitialized,
    isClientReady,
    initializationAttempted,
    join,
    startPublishing,
    stopPublishing,
    leave,
    onViewerCountChange,
  ])

  useEffect(() => {
    if (localVideoTrack && videoRef.current && !hasTriedToPlay) {
      try {
        console.log("Playing local video track")
        localVideoTrack.play(videoRef.current)
        setHasTriedToPlay(true)
      } catch (error) {
        console.error("Failed to play local video:", error)
      }
    }
  }, [localVideoTrack, hasTriedToPlay])

  useEffect(() => {
    if (isPublishing) {
      toggleVideo(isVideoEnabled)
      toggleAudio(isAudioEnabled)
    }
  }, [isVideoEnabled, isAudioEnabled, isPublishing, toggleVideo, toggleAudio])

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
        return "BROADCASTING"
      case STREAM_STATUS.CONNECTING:
        return "CONNECTING"
      case STREAM_STATUS.OFFLINE:
        return "OFFLINE"
      case STREAM_STATUS.ERROR:
        return "ERROR"
      default:
        return "READY"
    }
  }

  const hasError = streamStatus === STREAM_STATUS.ERROR || configError
  const isLoading = !isClientReady || (isLive && !isInitialized && streamStatus === STREAM_STATUS.CONNECTING)

  if (connectionError) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6" style={{ height: "85vh" }}>
        <AgoraErrorHandler
          error={connectionError}
          onRetry={() => {
            setConnectionError(null)
            setInitializationAttempted(false)
            setIsInitialized(false)
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
            {!isClientReady ? "Initializing Agora client..." : "Starting broadcast..."}
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
      className="w-full bg-gradient-to-br from-gray-800 to-gray-900 relative rounded-lg overflow-hidden"
      style={{ height: "85vh" }}
    >
      {isLive && isPublishing ? (
        <>
          <div ref={videoRef} className="w-full h-full" />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <VideoOff className="w-10 h-10" />
                </div>
                <p className="text-2xl font-bold mb-2">Camera is off</p>
                <p className="text-lg text-gray-300 font-medium">Viewers can still hear your audio</p>
              </div>
            </div>
          )}

          {/* Live indicator */}
          <div
            className={`absolute top-6 left-6 ${getStatusColor()} text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg backdrop-blur-sm`}
          >
            <div
              className={`w-3 h-3 bg-white rounded-full ${streamStatus === STREAM_STATUS.LIVE ? "animate-pulse" : ""}`}
            ></div>
            <span>{getStatusText()}</span>
          </div>

          {/* Connection Status */}
          <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-sm rounded-full p-3">
            {isJoined ? <Wifi className="w-6 h-6 text-green-400" /> : <WifiOff className="w-6 h-6 text-red-400" />}
          </div>

          {/* Viewer count */}
          {streamStatus === STREAM_STATUS.LIVE && (
            <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
              {viewerCount} viewer{viewerCount !== 1 ? "s" : ""}
            </div>
          )}

          {/* Debug Info */}
          <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-medium">
            <div>Status: {getStatusText()}</div>
            <div>Publishing: {isPublishing ? "Yes" : "No"}</div>
            <div>Joined: {isJoined ? "Yes" : "No"}</div>
            <div>Client Ready: {isClientReady ? "Yes" : "No"}</div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              {hasError ? <AlertCircle className="w-12 h-12 text-white" /> : <Video className="w-12 h-12 text-white" />}
            </div>
            <p className="text-3xl font-bold mb-4">{hasError ? "Configuration Error" : "Ready to go live"}</p>
            <p className="text-lg text-gray-300 font-medium">
              {hasError ? "Please configure Agora App ID" : "Click 'Go Live' to start broadcasting"}
            </p>
            {configError && <p className="text-sm text-red-400 mt-4 font-medium">{configError}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
