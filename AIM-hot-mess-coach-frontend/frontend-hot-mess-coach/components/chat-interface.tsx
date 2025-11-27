"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, Sparkles } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

// Get backend URL - use environment variable, relative URL for same domain, or fallback
const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  
  if (typeof window !== "undefined") {
    // If on localhost, use local backend
    if (window.location.hostname === "localhost") {
      return "http://localhost:8000/api/chat"
    }
    // Otherwise use relative URL (same domain) - works for Vercel deployments
    return "/api/chat"
  }
  
  // Fallback for SSR
  return "/api/chat"
}

const BACKEND_URL = getBackendUrl()

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there, Hot Mess! 🦃 I'm your Thanksgiving survival coach. Whether you're dealing with family drama, cooking disasters, or just need someone to talk to - I'm here! What's on your mind?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      })

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.statusText}`)
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error("[v0] Error calling backend:", err)
      setError(err instanceof Error ? err.message : "Something went wrong!")

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oops! 🍂 Looks like I got lost in the cranberry sauce. Can you try that again?",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <header className="mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-5xl md:text-6xl animate-wiggle">🦃</span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary text-balance">Hot Mess Coach</h1>
          <span className="text-5xl md:text-6xl animate-wiggle" style={{ animationDelay: "0.2s" }}>
            🍂
          </span>
        </div>
        <p className="text-muted-foreground text-lg">Your chaotic Thanksgiving survival guide 🥧</p>
        <div className="flex items-center justify-center gap-2 mt-2 text-sm">
          <span className="animate-bounce-gentle">🍁</span>
          <span className="animate-bounce-gentle" style={{ animationDelay: "0.3s" }}>
            🌽
          </span>
          <span className="animate-bounce-gentle" style={{ animationDelay: "0.6s" }}>
            🥔
          </span>
          <span className="animate-bounce-gentle" style={{ animationDelay: "0.9s" }}>
            🥧
          </span>
        </div>
      </header>

      {/* Chat Messages */}
      <Card className="flex-1 mb-4 overflow-hidden border-2 shadow-lg">
        <ScrollArea className="h-full p-4 md:p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Coach is thinking...</span>
                  <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2 text-sm border border-destructive/20">
                  {error}
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </Card>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Share your Thanksgiving chaos here... 🎃"
          disabled={isLoading}
          className="flex-1 text-base py-6 border-2 focus-visible:ring-primary"
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          size="lg"
          className="px-6 shadow-lg hover:shadow-xl transition-all"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </Button>
      </div>

      {/* Decorative Footer */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-2 flex-wrap">
          <span>Made with</span>
          <span className="text-accent animate-pulse">🧡</span>
          <span>and a side of chaos</span>
          <span className="animate-float">🦃</span>
        </p>
      </div>
    </div>
  )
}
