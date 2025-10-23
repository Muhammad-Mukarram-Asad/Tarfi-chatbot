/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import Image from "next/image"
import styles from "./chatInput.module.scss"
import { useEffect, useRef, useState } from "react"
import sendIconDisable from "../../../../public/icons/send-icon-disable.svg";
import sendIcon from "../../../../public/icons/send.svg";

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

declare global {
  interface Window {
    scrollTimeout?: NodeJS.Timeout
  }
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mainDivRef = useRef<HTMLDivElement>(null)
  const [hasUserScrolled, setHasUserScrolled] = useState(false)
  const [showScrollbar, setShowScrollbar] = useState(false)
  const [currentInput, setCurrentInput] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      e.preventDefault();
      setShowScrollbar(false);
      handleSend()
    }
  }

  const handleScroll = () => {
    const textarea = textareaRef.current
    if (textarea) {
      setHasUserScrolled(true)
      setShowScrollbar(true)

      if (window.scrollTimeout) {
        clearTimeout(window.scrollTimeout)
      }
      window.scrollTimeout = setTimeout(() => {
        if (!hasUserScrolled) {
          setShowScrollbar(false)
        }
      }, 1500)
    }
  }

  const updateTextareaHeight = (textarea: HTMLTextAreaElement, text: string) => {
    const mainDiv = mainDivRef.current
    
    if (!mainDiv) return

    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    if (context) {
      context.font = "14px Manrope, sans-serif"
      const textWidth = context.measureText(text).width
      const availableWidth = textarea.clientWidth - 20

      const baseHeight = 50
      const lineHeight = 24
      const maxHeight = 144

      if (text.trim() === "") {
        // Empty - reset to base height
        textarea.style.height = `${baseHeight}px`
        mainDiv.style.height = "64px"
        
        // Reset scroll and scrollbar when empty
        textarea.scrollTop = 0
        setShowScrollbar(false)
        setHasUserScrolled(false)
      } else if (textWidth <= availableWidth) {
        // Single line
        textarea.style.height = `${baseHeight}px`
        mainDiv.style.height = "64px"
        
        // Reset scroll for single line
        textarea.scrollTop = 0
        setShowScrollbar(false)
        setHasUserScrolled(false)
      } else {
        // Multiple lines
        const estimatedLines = Math.ceil(textWidth / availableWidth)
        const calculatedHeight = baseHeight + (estimatedLines - 1) * lineHeight
        const newHeight = Math.min(calculatedHeight, maxHeight)
        
        textarea.style.height = `${newHeight}px`
        mainDiv.style.height = `${newHeight + 14}px`
        
        // Only show scrollbar if content exceeds max height
        if (calculatedHeight > maxHeight) {
          // Content is taller than max height - scrollbar needed
          if (!hasUserScrolled) {
            textarea.scrollTop = textarea.scrollHeight
          }
        } else {
          // Content fits without scrolling
          textarea.scrollTop = 0
          setShowScrollbar(false)
          setHasUserScrolled(false)
        }
      }
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentText = e.target.value
    const textarea = textareaRef.current

    if (textarea) {
      updateTextareaHeight(textarea, currentText)
    }
  }

  // Use effect to handle programmatic value changes (like suggestions)
  useEffect(() => {
    if (textareaRef.current) {
      updateTextareaHeight(textareaRef.current, value)
    }
  }, [value])

  const handleSend = () => {
    onSend()
    const textarea = textareaRef.current
    const mainDiv = mainDivRef.current

    setHasUserScrolled(false)
    setShowScrollbar(false)
    setCurrentInput("");

    if (textarea && mainDiv) {
      textarea.style.height = "50px"
      mainDiv.style.height = "64px"
      textarea.scrollTop = 0
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    setTimeout(() => {
      if (textareaRef.current) {
        const textarea = textareaRef.current
        const mainDiv = mainDivRef.current

        if (mainDiv) {
          const currentText = textarea.value
          const canvas = document.createElement("canvas")
          const context = canvas.getContext("2d")
          
          if (context) {
            context.font = "14px Manrope, sans-serif"
            const textWidth = context.measureText(currentText).width
            const availableWidth = textarea.clientWidth - 20

            const baseHeight = 50
            const lineHeight = 24
            const maxHeight = 144

            if (currentText.trim() === "") {
              textarea.style.height = `${baseHeight}px`
              mainDiv.style.height = "64px"
              textarea.scrollTop = 0
              setShowScrollbar(false)
            } else if (textWidth <= availableWidth) {
              textarea.style.height = `${baseHeight}px`
              mainDiv.style.height = "64px"
              textarea.scrollTop = 0
              setShowScrollbar(false)
            } else {
              const estimatedLines = Math.ceil(textWidth / availableWidth)
              const calculatedHeight = baseHeight + (estimatedLines - 1) * lineHeight
              const newHeight = Math.min(calculatedHeight, maxHeight)
              
              textarea.style.height = `${newHeight}px`
              mainDiv.style.height = `${newHeight + 14}px`
              
              // Only scroll to top if content doesn't exceed max height
              if (calculatedHeight <= maxHeight) {
                textarea.scrollTop = 0
                setShowScrollbar(false)
              }
            }
          }
        }
      }
    }, 0)
  }

  return (
    <main ref={mainDivRef} className={styles["chat_input_main_div"]}>
      <textarea
        ref={textareaRef}
        onPaste={handlePaste}
        onScroll={handleScroll}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setCurrentInput(e.target.value)
          handleInput(e)
        }}
        placeholder="ask me anything..."
        className={`${styles["chat_input_textarea"]} ${showScrollbar ? styles["show_scrollbar"] : ""}`}
        onKeyUp={handleKeyPress}
        disabled={disabled}
        aria-label="Chat message input"
        aria-describedby="char-count"
        id="chat-input"
      />
      <div className={styles["chat_input_button_div"]}>
        <button onClick={handleSend} disabled={disabled || !value.trim()} aria-label="Send message">
          {disabled ? (
            <Image src={sendIconDisable || "/placeholder.svg"} alt="Send" width={40} height={40} />
          ) : (
            <Image src={sendIcon || "/placeholder.svg"} alt="Send" width={40} height={40} />
          )}
        </button>
      </div>
    </main>
  )
}