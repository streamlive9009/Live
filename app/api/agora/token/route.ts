import { type NextRequest, NextResponse } from "next/server"
import { RtcTokenBuilder, RtcRole } from "agora-access-token"
import { AGORA_CONFIG, isSecureModeConfigured } from "@/lib/agora-config"

export async function POST(request: NextRequest) {
  try {
    const { channel, uid, role, expirationTime } = await request.json()

    // Validate required parameters
    if (!channel || !uid || !role) {
      return NextResponse.json(
        {
          error: "Missing required parameters",
          required: ["channel", "uid", "role"],
        },
        { status: 400 },
      )
    }

    // Check if Secure Mode is properly configured
    if (!isSecureModeConfigured()) {
      console.error("Agora Secure Mode not configured properly")
      return NextResponse.json(
        {
          error: "Server configuration error",
          message: "Agora App Certificate not configured",
          token: null,
        },
        { status: 500 },
      )
    }

    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID!
    const appCertificate = process.env.AGORA_APP_CERTIFICATE!

    // Set token expiration time (default 24 hours)
    const currentTime = Math.floor(Date.now() / 1000)
    const expireTime = currentTime + (expirationTime || AGORA_CONFIG.tokenExpirationTime)

    // Determine Agora role
    let agoraRole: RtcRole
    if (role === "publisher") {
      agoraRole = RtcRole.PUBLISHER
    } else if (role === "subscriber") {
      agoraRole = RtcRole.SUBSCRIBER
    } else {
      return NextResponse.json(
        {
          error: "Invalid role",
          message: "Role must be 'publisher' or 'subscriber'",
        },
        { status: 400 },
      )
    }

    // Generate the token
    const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channel, uid, agoraRole, expireTime)

    console.log(`Generated token for channel: ${channel}, uid: ${uid}, role: ${role}`)

    return NextResponse.json({
      token,
      uid,
      channel,
      appId,
      expiresAt: expireTime,
      role,
      message: "Token generated successfully",
    })
  } catch (error) {
    console.error("Token generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate token",
        message: error instanceof Error ? error.message : "Unknown error",
        token: null,
      },
      { status: 500 },
    )
  }
}

// GET endpoint for token refresh
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const channel = searchParams.get("channel")
  const uid = searchParams.get("uid")
  const role = searchParams.get("role")

  if (!channel || !uid || !role) {
    return NextResponse.json(
      {
        error: "Missing query parameters",
        required: ["channel", "uid", "role"],
      },
      { status: 400 },
    )
  }

  // Reuse POST logic
  return POST(
    new Request(request.url, {
      method: "POST",
      body: JSON.stringify({
        channel,
        uid: Number.parseInt(uid),
        role,
      }),
    }),
  )
}
