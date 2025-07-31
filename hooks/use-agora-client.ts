"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import AgoraRTC, {
  type IAgoraRTCClient,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
  type IRemoteVideoTrack,
  type IRemoteAudioTrack,
} from "agora-rtc-sdk-ng"
import { AGORA_CONFIG, STREAM_STATUS, isAgoraConfigured, getAgoraAppId, generateUID } from "@/lib/agora-config"
import { tokenManager } from "@/lib/token-manager"

interface UseAgoraClientProps {
  role: "host" | "audience"
  onUserJoined?: (uid: number) => void
  onUserLeft?: (uid: number) => void
  onStreamStatusChange?: (status: string) => void
  onTokenExpired?: () => void
}

export function useAgoraClient({
  role,
  onUserJoined,
  onUserLeft,
  onStreamStatusChange,
  onTokenExpired,
}: UseAgoraClientProps) {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null)
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null)
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null)
  const [remoteUsers, setRemoteUsers] = useState<
    Map<number, { videoTrack?: IRemoteVideoTrack; audioTrack?: IRemoteAudioTrack }>
  >(new Map())
  const [isJoined, setIsJoined] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [streamStatus, setStreamStatus] = useState(STREAM_STATUS.OFFLINE)
  const [isClientReady, setIsClientReady] = useState(false)
  const [configError, setConfigError] = useState<string | null>(null)
  const [currentUID, setCurrentUID] = useState<number | null>(null)
  const [currentChannel, setCurrentChannel] = useState<string | null>(null)

  // Use refs to store callback functions
  const onUserJoinedRef = useRef(onUserJoined)
  const onUserLeftRef = useRef(onUserLeft)
  const onStreamStatusChangeRef = useRef(onStreamStatusChange)
  const onTokenExpiredRef = useRef(onTokenExpired)

  // Update refs when callbacks change
  useEffect(() => {
    onUserJoinedRef.current = onUserJoined
  }, [onUserJoined])

  useEffect(() => {
    onUserLeftRef.current = onUserLeft
  }, [onUserLeft])

  useEffect(() => {
    onStreamStatusChangeRef.current = onStreamStatusChange
  }, [onStreamStatusChange])

  useEffect(() => {
    onTokenExpiredRef.current = onTokenExpired
  }, [onTokenExpired])

  const updateStreamStatus = useCallback((status: string) => {
    console.log("Stream status updated:", status)
    setStreamStatus(status)
    onStreamStatusChangeRef.current?.(status)
  }, [])

  // Initialize Agora client
  useEffect(() => {
    if (!isAgoraConfigured()) {
      const appId = getAgoraAppId()
      const errorMsg = `Agora App ID not configured. Current value: "${appId}". Please set NEXT_PUBLIC_AGORA_APP_ID environment variable.`
      console.error(errorMsg)
      setConfigError(errorMsg)
      updateStreamStatus(STREAM_STATUS.ERROR)
      setIsClientReady(false)
      return
    }

    const appId = getAgoraAppId()
    console.log("Initializing Agora client with Secure Mode, role:", role, "App ID:", appId)

    try {
      const agoraClient = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8",
      })

      agoraClient.setClientRole(role === "host" ? "host" : "audience")

      // Enhanced event listeners with token handling
      agoraClient.on("user-published", async (user, mediaType) => {
        try {
          console.log("User published:", user.uid, mediaType)
          await agoraClient.subscribe(user, mediaType)

          setRemoteUsers((prev) => {
            const newUsers = new Map(prev)
            const userData = newUsers.get(user.uid as number) || {}

            if (mediaType === "video") {
              userData.videoTrack = user.videoTrack
              updateStreamStatus(STREAM_STATUS.LIVE)
            } else if (mediaType === "audio") {
              userData.audioTrack = user.audioTrack
            }

            newUsers.set(user.uid as number, userData)
            return newUsers
          })

          onUserJoinedRef.current?.(user.uid as number)
        } catch (error) {
          console.error("Failed to subscribe to user:", error)
          updateStreamStatus(STREAM_STATUS.ERROR)
        }
      })

      agoraClient.on("user-unpublished", (user, mediaType) => {
        console.log("User unpublished:", user.uid, mediaType)
        setRemoteUsers((prev) => {
          const newUsers = new Map(prev)
          const userData = newUsers.get(user.uid as number)

          if (userData) {
            if (mediaType === "video") {
              userData.videoTrack = undefined
              if (role === "audience" && newUsers.size === 1) {
                updateStreamStatus(STREAM_STATUS.OFFLINE)
              }
            } else if (mediaType === "audio") {
              userData.audioTrack = undefined
            }

            if (!userData.videoTrack && !userData.audioTrack) {
              newUsers.delete(user.uid as number)
            } else {
              newUsers.set(user.uid as number, userData)
            }
          }

          return newUsers
        })
      })

      agoraClient.on("user-left", (user) => {
        console.log("User left:", user.uid)
        setRemoteUsers((prev) => {
          const newUsers = new Map(prev)
          newUsers.delete(user.uid as number)

          if (role === "audience" && newUsers.size === 0) {
            updateStreamStatus(STREAM_STATUS.OFFLINE)
          }

          return newUsers
        })
        onUserLeftRef.current?.(user.uid as number)
      })

      // Token privilege will expire event
      agoraClient.on("token-privilege-will-expire", async () => {
        console.warn("Token privilege will expire, refreshing...")
        if (currentUID && currentChannel) {
          try {
            const tokenRole = role === "host" ? "publisher" : "subscriber"
            const tokenData = await tokenManager.refreshToken(currentChannel, currentUID, tokenRole)
            await agoraClient.renewToken(tokenData.token)
            console.log("Token refreshed successfully")
          } catch (error) {
            console.error("Failed to refresh token:", error)
            updateStreamStatus(STREAM_STATUS.TOKEN_EXPIRED)
            onTokenExpiredRef.current?.()
          }
        }
      })

      // Token privilege did expire event
      agoraClient.on("token-privilege-did-expire", () => {
        console.error("Token privilege expired")
        updateStreamStatus(STREAM_STATUS.TOKEN_EXPIRED)
        onTokenExpiredRef.current?.()
      })

      agoraClient.on("connection-state-change", (curState, revState) => {
        console.log("Connection state changed:", curState, "from", revState)
        if (curState === "CONNECTED") {
          updateStreamStatus(role === "host" ? STREAM_STATUS.CONNECTING : STREAM_STATUS.CONNECTING)
        } else if (curState === "DISCONNECTED") {
          updateStreamStatus(STREAM_STATUS.OFFLINE)
        }
      })

      agoraClient.on("exception", (evt) => {
        console.error("Agora exception:", evt)
        if (evt.code === "INVALID_TOKEN" || evt.code === "TOKEN_EXPIRED") {
          updateStreamStatus(STREAM_STATUS.TOKEN_EXPIRED)
          onTokenExpiredRef.current?.()
        } else {
          updateStreamStatus(STREAM_STATUS.ERROR)
        }
      })

      setClient(agoraClient)
      setIsClientReady(true)
      setConfigError(null)
      console.log("Agora client initialized successfully with Secure Mode")
    } catch (error) {
      console.error("Failed to initialize Agora client:", error)
      setConfigError(`Failed to initialize Agora client: ${error}`)
      updateStreamStatus(STREAM_STATUS.ERROR)
      setIsClientReady(false)
    }

    return () => {
      console.log("Cleaning up Agora client")
      tokenManager.clearAll()
      if (client) {
        client.removeAllListeners()
        if (client.connectionState !== "DISCONNECTED") {
          client.leave().catch(console.error)
        }
      }
    }
  }, [role, updateStreamStatus, currentUID, currentChannel])

  const join = useCallback(
    async (channel: string = AGORA_CONFIG.channel) => {
      if (!client || !isClientReady) {
        const error = "Agora client not ready"
        console.error(error)
        return Promise.reject(new Error(error))
      }

      if (!isAgoraConfigured()) {
        const error = "Agora App ID not configured"
        console.error(error)
        updateStreamStatus(STREAM_STATUS.ERROR)
        return Promise.reject(new Error(error))
      }

      try {
        console.log("Joining channel with Secure Mode:", channel, "as", role)
        updateStreamStatus(STREAM_STATUS.CONNECTING)

        const uid = generateUID()
        const appId = getAgoraAppId()
        const tokenRole = role === "host" ? "publisher" : "subscriber"

        // Request token from server
        console.log("Requesting token for Secure Mode...")
        const tokenData = await tokenManager.requestToken({
          channel,
          uid,
          role: tokenRole,
        })

        console.log("Token received, joining channel...")
        await client.join(appId, channel, tokenData.token, uid)

        setIsJoined(true)
        setCurrentUID(uid)
        setCurrentChannel(channel)

        console.log("Successfully joined Agora channel with token:", channel, "UID:", uid)

        if (role === "audience") {
          updateStreamStatus(STREAM_STATUS.CONNECTING)
        }

        return uid
      } catch (error) {
        console.error("Failed to join Agora channel:", error)
        updateStreamStatus(STREAM_STATUS.ERROR)
        throw error
      }
    },
    [client, isClientReady, updateStreamStatus, role],
  )

  const leave = useCallback(async () => {
    if (!client) {
      console.log("No client to leave")
      return
    }

    try {
      console.log("Leaving Agora channel")

      if (isPublishing) {
        await stopPublishing()
      }

      await client.leave()
      setIsJoined(false)
      setCurrentUID(null)
      setCurrentChannel(null)
      setRemoteUsers(new Map())
      updateStreamStatus(STREAM_STATUS.OFFLINE)

      // Clear tokens
      tokenManager.clearAll()

      console.log("Left Agora channel successfully")
    } catch (error) {
      console.error("Failed to leave Agora channel:", error)
    }
  }, [client, isPublishing, updateStreamStatus])

  const startPublishing = useCallback(async () => {
    if (!client || !isJoined || !isClientReady) {
      const error = "Cannot start publishing: client not ready or not joined"
      console.error(error)
      return Promise.reject(new Error(error))
    }

    try {
      console.log("Starting to publish video and audio with Secure Mode")
      updateStreamStatus(STREAM_STATUS.CONNECTING)

      const videoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: {
          width: 1280,
          height: 720,
          frameRate: 30,
          bitrateMax: 1000,
          bitrateMin: 300,
        },
      })

      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: "music_standard",
      })

      await client.publish([videoTrack, audioTrack])

      setLocalVideoTrack(videoTrack)
      setLocalAudioTrack(audioTrack)
      setIsPublishing(true)
      updateStreamStatus(STREAM_STATUS.LIVE)

      console.log("Successfully started publishing with token authentication")
    } catch (error) {
      console.error("Failed to start publishing:", error)
      updateStreamStatus(STREAM_STATUS.ERROR)
      throw error
    }
  }, [client, isJoined, isClientReady, updateStreamStatus])

  const stopPublishing = useCallback(async () => {
    if (!client) {
      console.log("No client to stop publishing")
      return
    }

    try {
      console.log("Stopping publishing")

      if (localVideoTrack) {
        localVideoTrack.close()
        setLocalVideoTrack(null)
      }

      if (localAudioTrack) {
        localAudioTrack.close()
        setLocalAudioTrack(null)
      }

      if (isPublishing) {
        await client.unpublish()
      }

      setIsPublishing(false)
      updateStreamStatus(STREAM_STATUS.OFFLINE)

      console.log("Stopped publishing successfully")
    } catch (error) {
      console.error("Failed to stop publishing:", error)
    }
  }, [client, localVideoTrack, localAudioTrack, isPublishing, updateStreamStatus])

  const toggleVideo = useCallback(
    async (enabled: boolean) => {
      if (localVideoTrack) {
        console.log("Toggling video:", enabled)
        await localVideoTrack.setEnabled(enabled)
      }
    },
    [localVideoTrack],
  )

  const toggleAudio = useCallback(
    async (enabled: boolean) => {
      if (localAudioTrack) {
        console.log("Toggling audio:", enabled)
        await localAudioTrack.setEnabled(enabled)
      }
    },
    [localAudioTrack],
  )

  return {
    client,
    localVideoTrack,
    localAudioTrack,
    remoteUsers,
    isJoined,
    isPublishing,
    streamStatus,
    isClientReady,
    configError,
    currentUID,
    currentChannel,
    join,
    leave,
    startPublishing,
    stopPublishing,
    toggleVideo,
    toggleAudio,
  }
}
