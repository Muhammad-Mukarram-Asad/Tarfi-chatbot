"use client"

import { useState } from "react"
import { ChatHeader } from "@/components/chats/chat-header"
import { MessageBubble } from "@/components/chats/message-bubble"
import { LoadingBubble } from "@/components/chats/loading-bubble"
import { ChatInput } from "@/components/chats/chat-input"

interface Message {
  id: number
  type: "text" | "table" | "line-chart" | "bar-chart" | "loading"
  content?: string
  isUser: boolean
  color:string,
  bgcolor:string
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: "text",
    content:
      "Hi! I'm here to help you with your business analytics and data visualization needs. What would you like to explore today?",
    isUser: false,
    color:"border-b border-b-gray-300",
    bgcolor:'bg-white'
  },
]

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      type: "text",
      content: inputValue,
      isUser: true,
        color:"border-b border-b-gray-300",
        bgcolor:'bg-white'
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setIsLoading(false)

      // Determine response type based on input
      let responseMessage: Message

      if (currentInput.toLowerCase().includes("table") || currentInput.toLowerCase().includes("data")) {
        responseMessage = {
          id: Date.now() + 1,
          type: "table",
          isUser: false,
          color:"border-b border-b-gray-300",
          bgcolor:'bg-white'
        }
      } else if (currentInput.toLowerCase().includes("line") || currentInput.toLowerCase().includes("trend")) {
        responseMessage = {
          id: Date.now() + 1,
          type: "line-chart",
          isUser: false,
          
          color:"border-b border-b-gray-300",
          bgcolor:'bg-white'
        }
      } else if (currentInput.toLowerCase().includes("bar") || currentInput.toLowerCase().includes("comparison")) {
        responseMessage = {
          id: Date.now() + 1,
          type: "bar-chart",
          isUser: false,
            color:"border-b border-b-gray-300",
            bgcolor:'bg-white'
        }
      } else {
        responseMessage = {
          id: Date.now() + 1,
          type: "text",
          content:
            "I can help you with various data visualizations including tables, line charts, and bar charts. Just let me know what type of analysis you need!",
          isUser: false,
            color:"border-b border-b-gray-300",
            bgcolor:'bg-white'
        }
      }

      setMessages((prev) => [...prev, responseMessage])
    }, 1500)
  }

  return (
    <div className="flex flex-col h-screen bg-white max-w-sm mx-auto">
      <ChatHeader />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && <LoadingBubble />}
      </div>

      <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} disabled={isLoading} />
    </div>
  )
}