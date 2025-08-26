"use client"

import type React from "react"


import Image from "next/image"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      onSend()
    }
  }

  return (
    <div 

      className=" rounded "
  style={{
    border: "2px solid transparent",
    borderRadius: "16px",
    background: "linear-gradient(white, white) padding-box, linear-gradient(to right,  #22d3ee, #0d9488) border-box",
  }}
     >
      <div className="flex items-center gap-2">
        {/* <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 rounded-full border-gray-200"
          onKeyPress={handleKeyPress}
          disabled={disabled}
        /> */}

        <textarea
  value={value}
  onChange={(e) => onChange(e.target.value)}
  placeholder="Ask me anything..."
  className="flex-1 rounded-lg focus:outline-none px-3 py-2 resize-none overflow-y-auto h-24"
  onKeyPress={handleKeyPress}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  disabled={disabled}
/>
        <button
          onClick={onSend}
       //   size="sm"
          className="rounded-full bg-teal-500 hover:bg-teal-600 w-10 h-10 mx-2"
          disabled={disabled || !value.trim()}
        >
         <Image src={'/send.svg'} alt="Send" width={40} height={40} />
        </button>
      </div>
    </div>
  )
}