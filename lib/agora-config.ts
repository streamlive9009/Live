// Enhanced Agora configuration with Secure Mode support
export const AGORA_CONFIG = {
  // App ID from Agora Console
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || "",
  // App Certificate (server-side only, never expose to client)
  appCertificate: process.env.AGORA_APP_CERTIFICATE || "",
  // Default channel name
  channel: "main-live-stream",
  // Token expiration time (24 hours)
  tokenExpirationTime: 24 * 3600, // 24 hours in seconds
  // Privilege expiration time (24 hours)
  privilegeExpirationTime: 24 * 3600,
}

export const AGORA_MODES = {
  LIVE: "live",
  RTC: "rtc",
} as const

export const CLIENT_ROLES = {
  HOST: "host",
  AUDIENCE: "audience",
} as const

export const STREAM_STATUS = {
  OFFLINE: "offline",
  CONNECTING: "connecting",
  LIVE: "live",
  ERROR: "error",
  TOKEN_EXPIRED: "token_expired",
} as const

// Token roles for Agora
export const TOKEN_ROLES = {
  PUBLISHER: 1, // Can publish and subscribe
  SUBSCRIBER: 2, // Can only subscribe
} as const

// Check if Agora is properly configured for Secure Mode
export const isAgoraConfigured = () => {
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID
  return appId && appId !== "" && appId !== "your-agora-app-id"
}

// Check if Secure Mode is properly configured (server-side only)
export const isSecureModeConfigured = () => {
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID
  const appCertificate = process.env.AGORA_APP_CERTIFICATE
  return appId && appCertificate && appId !== "" && appCertificate !== ""
}

// Get Agora App ID with fallback
export const getAgoraAppId = () => {
  return process.env.NEXT_PUBLIC_AGORA_APP_ID || AGORA_CONFIG.appId
}

// Generate a unique UID
export const generateUID = () => {
  return Math.floor(Math.random() * 1000000)
}

// Debug configuration
export const getAgoraDebugInfo = () => {
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || AGORA_CONFIG.appId
  return {
    appId: appId,
    isConfigured: isAgoraConfigured(),
    channel: AGORA_CONFIG.channel,
    secureModeEnabled: true,
    hasAppCertificate: !!process.env.AGORA_APP_CERTIFICATE,
  }
}

// Token request interface
export interface TokenRequest {
  channel: string
  uid: number
  role: "publisher" | "subscriber"
  expirationTime?: number
}

// Token response interface
export interface TokenResponse {
  token: string
  uid: number
  channel: string
  appId: string
  expiresAt: number
  role: string
}
