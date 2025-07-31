import { type NextRequest, NextResponse } from "next/server"

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: string
  isModel?: boolean
}

// In a real application, you'd use a database or real-time service
let messages: ChatMessage[] = []

export async function GET() {
  return NextResponse.json({ messages })
}

export async function POST(request: NextRequest) {
  try {
    const { user, message } = await request.json()

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user,
      message,
      timestamp: new Date().toISOString(),
    }

    messages.push(newMessage)

    // Keep only last 100 messages
    if (messages.length > 100) {
      messages = messages.slice(-100)
    }

    return NextResponse.json({ success: true, message: newMessage })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
