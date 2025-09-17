/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import type React from "react";
// import Image from "next/image";
// import styles from "./chatInput.module.scss";
// import { useRef } from "react";
// import sendIconDisable from "../../../../public/send-icon-disable.svg";
// import sendIcon from "../../../../public/send.svg";

// interface ChatInputProps {
//   value: string;
//   onChange: (value: string) => void;
//   onSend: () => void;
//   disabled?: boolean;
// }

// export function ChatInput({
//   value,
//   onChange,
//   onSend,
//   disabled,
// }: ChatInputProps) {
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const mainDivRef = useRef<HTMLDivElement>(null); // Reference for the main div
//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !disabled) {
//       handleSend();
//     }
//   };

//   const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const currentText = e.target.value; // Real-time value of the input field
//     const textarea = textareaRef.current;
//     const mainDiv = mainDivRef.current;

//     if (textarea && mainDiv) {
//       textarea.style.height = "50px"; // Reset textarea height
//       const newHeight = Math.min(textarea.scrollHeight, 144); // Calculate new height for textarea
//       if (currentText.trim() === "") {
//         // Reset heights when the input field is empty
//         textarea.style.height = "64px";
//         mainDiv.style.height = "64px";
//       } else if (newHeight > 50) {
//         // Adjust heights only when content exceeds one line
//         textarea.style.height = `${newHeight}px`;
//         mainDiv.style.height = `${Math.min(newHeight + 20, 168)}px`; // Adjust main div height dynamically
//       }
//     }
//   };

//   const handleSend = () => {
//     onSend();
//     const textarea = textareaRef.current;
//     const mainDiv = mainDivRef.current;
//     if (textarea && mainDiv) {
//       textarea.style.height = "64px"; // Reset textarea height
//       mainDiv.style.height = "64px"; // Reset main div height
//     }
//   };

//   return (
//     <main ref={mainDivRef} className={styles["chat_input_main_div"]}>
//       <div className={styles["chat_input_textarea_div"]}>
//         <textarea
//           ref={textareaRef}
//           onInput={handleInput} // Trigger functionality on input
//           onFocus={handleInput} // Trigger functionality on focus
//           onPaste={(e) => {
//             // Wait for paste to update textarea value, then adjust height
//             setTimeout(() => {
//               if (textareaRef.current) {
//                 // Create a synthetic ChangeEvent to reuse handleInput
//                 const event = {
//                   ...e,
//                   target: textareaRef.current,
//                 } as React.ChangeEvent<HTMLTextAreaElement>;
//                 handleInput(event);
//               }
//             }, 0);
//           }} // Trigger functionality on paste
//           value={value}
//           onChange={(e) => {
//             onChange(e.target.value); // Update the value in real-time
//             handleInput(e); // Pass the event to handleInput for height adjustment
//           }}
//           placeholder="ask me anything..."
//           className={styles["chat_input_textarea"]}
//           onKeyUp={handleKeyPress}
//           maxLength={300}
//           disabled={disabled}
//         />
//         <div className={styles["chat_input_button_div"]}>
//           <button onClick={handleSend} disabled={disabled || !value.trim()}>
//             {disabled ? (
//               <Image src={sendIconDisable} alt="Send" width={40} height={40} />
//             ) : (
//               <Image src={sendIcon} alt="Send" width={40} height={40} />
//             )}
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client"

import type React from "react"
import Image from "next/image"
import styles from "./chatInput.module.scss"
import { useRef, useState } from "react"
import sendIconDisable from "../../../../public/send-icon-disable.svg";
import sendIcon from "../../../../public/send.svg";

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

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentText = e.target.value
    const textarea = textareaRef.current
    const mainDiv = mainDivRef.current

    setHasUserScrolled(false)
    setShowScrollbar(false)

    if (textarea && mainDiv) {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      if (context) {
        // Set font properties to match textarea
        context.font = "500 15px system-ui, -apple-system, sans-serif"

        // Measure actual text width
        const textWidth = context.measureText(currentText).width
        const availableWidth = textarea.clientWidth - 24 // Account for padding

        const baseHeight = 50
        const lineHeight = 22

        if (currentText.trim() === "") {
          // Empty input
          textarea.style.height = `${baseHeight}px`
          mainDiv.style.height = "64px"
        } else if (textWidth <= availableWidth) {
          // Text fits in single line - keep base height
          textarea.style.height = `${baseHeight}px`
          mainDiv.style.height = "64px"
        } else {
          // Text needs to wrap - calculate required lines
          const estimatedLines = Math.ceil(textWidth / availableWidth)
          const newHeight = Math.min(baseHeight + (estimatedLines - 1) * lineHeight, 144)
          textarea.style.height = `${newHeight}px`
          mainDiv.style.height = `${newHeight + 14}px`
        }
      }

      if (!hasUserScrolled) {
        textarea.scrollTop = textarea.scrollHeight
      }
    }
  }

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
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    setTimeout(() => {
      if (textareaRef.current) {
        const textarea = textareaRef.current
        const mainDiv = mainDivRef.current

        setHasUserScrolled(false)
        setShowScrollbar(false)

        if (mainDiv) {
          const currentText = textarea.value

          const canvas = document.createElement("canvas")
          const context = canvas.getContext("2d")
          if (context) {
            context.font = "500 15px system-ui, -apple-system, sans-serif"
            const textWidth = context.measureText(currentText).width
            const availableWidth = textarea.clientWidth - 24

            const baseHeight = 50
            const lineHeight = 22

            if (currentText.trim() === "") {
              textarea.style.height = `${baseHeight}px`
              mainDiv.style.height = "64px"
            } else if (textWidth <= availableWidth) {
              textarea.style.height = `${baseHeight}px`
              mainDiv.style.height = "64px"
            } else {
              const estimatedLines = Math.ceil(textWidth / availableWidth)
              const newHeight = Math.min(baseHeight + (estimatedLines - 1) * lineHeight, 144)
              textarea.style.height = `${newHeight}px`
              mainDiv.style.height = `${newHeight + 14}px`
            }
          }

          textarea.scrollTop = 0
        }
      }
    }, 0)
  }

  // const characterCount = currentInput?.length
  // const isNearLimit = characterCount > 250
  // const isAtLimit = characterCount >= 300

  return (
    <main ref={mainDivRef} className={styles["chat_input_main_div"]}>
      <div className={styles["chat_input_textarea_div"]}>
        <textarea
          ref={textareaRef}
          // onInput={handleInput}
          // onFocus={handleInput}
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
          // maxLength={300}
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
      </div>

      {/* {characterCount > 0 && (
        <div
          id="char-count"
          className={`${styles["char_count"]} ${isNearLimit ? styles["char_count_warning"] : ""} ${isAtLimit ? styles["char_count_limit"] : ""}`}
        >
          {characterCount}/300
        </div>
      )} */}
    </main>
  )
}
