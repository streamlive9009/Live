import { type NextRequest, NextResponse } from "next/server"

interface UserRegistration {
  fullName: string
  phoneNumber: string
}

export async function POST(request: NextRequest) {
  try {
    const { fullName, phoneNumber }: UserRegistration = await request.json()

    // Validate input
    if (!fullName || !phoneNumber) {
      return NextResponse.json({ error: "Full name and phone number are required" }, { status: 400 })
    }

    // In a real application, you'd save this to a database
    const user = {
      id: Date.now().toString(),
      fullName,
      phoneNumber,
      registeredAt: new Date().toISOString(),
    }

    console.log("User registered:", user)

    return NextResponse.json({
      success: true,
      user: { fullName, phoneNumber },
    })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
