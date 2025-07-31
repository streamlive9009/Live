"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle, Users } from "lucide-react"

interface User {
  fullName: string
  phoneNumber: string
}

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: Date
  isModel?: boolean
}

interface ChatSectionProps {
  user: User
}

export function ChatSection({ user }: ChatSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "Model Sarah",
      message: "Welcome to my live stream! Thanks for joining! 💕",
      timestamp: new Date(Date.now() - 300000),
      isModel: true,
    },
    {
      id: "2",
      user: "John Doe",
      message: "Great stream! Love the content",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: "3",
      user: "Model Sarah",
      message: "Thank you John! More exciting content coming up!",
      timestamp: new Date(Date.now() - 180000),
      isModel: true,
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isConnected, setIsConnected] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: user.fullName,
      message: newMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="h-[600px] flex flex-col shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-gray-900">Live Chat</span>
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} animate-pulse`}></div>
          </div>
          <div className="flex items-center space-x-1 text-sm font-medium text-gray-600">
            <Users className="w-4 h-4" />
            <span>{messages.length}</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <span className={`font-semibold ${message.isModel ? "text-purple-600" : "text-gray-700"}`}>
                    {message.user}
                    {message.isModel && (
                      <span className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                        MODEL
                      </span>
                    )}
                  </span>
                  <span className="text-gray-400 font-medium">{formatTime(message.timestamp)}</span>
                </div>
                <div
                  className={`p-3 rounded-lg max-w-[90%] ${
                    message.isModel
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200"
                      : "bg-gray-100 border border-gray-200 ml-4"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-800 break-words leading-relaxed">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-gray-200 p-4 bg-white/90 backdrop-blur-sm">
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 font-medium border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                maxLength={200}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-semibold px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Chatting as <span className="text-purple-600 font-semibold">{user.fullName}</span>
            </p>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
