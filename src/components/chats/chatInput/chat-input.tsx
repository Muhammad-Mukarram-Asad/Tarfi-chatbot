"use client";

import type React from "react";
import Image from "next/image";
import styles from "./chatInput.module.scss";
import { useRef } from "react";
import sendIconDisable from "../../../../public/send-icon-disable.svg";
import sendIcon from "../../../../public/send.svg";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mainDivRef = useRef<HTMLDivElement>(null); // Reference for the main div
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentText = e.target.value; // Real-time value of the input field
    const textarea = textareaRef.current;
    const mainDiv = mainDivRef.current;

    if (textarea && mainDiv) {
      textarea.style.height = "50px"; // Reset textarea height
      const newHeight = Math.min(textarea.scrollHeight, 144); // Calculate new height for textarea
      console.log("new height ", newHeight);
      if (currentText.trim() === "") {
        // Reset heights when the input field is empty
        textarea.style.height = "64px";
        mainDiv.style.height = "64px";
      } else if (newHeight > 50) {
        // Adjust heights only when content exceeds one line
        textarea.style.height = `${newHeight}px`;
        mainDiv.style.height = `${Math.min(newHeight + 20, 168)}px`; // Adjust main div height dynamically
      }
    }
  };

  const handleSend = () => {
    onSend();
    const textarea = textareaRef.current;
    const mainDiv = mainDivRef.current;
    if (textarea && mainDiv) {
      textarea.style.height = "64px"; // Reset textarea height
      mainDiv.style.height = "64px"; // Reset main div height
    }
  };

  return (
    <main ref={mainDivRef} className={styles["chat_input_main_div"]}>
      <div className={styles["chat_input_textarea_div"]}>
        <textarea
          ref={textareaRef}
          onInput={handleInput} // Trigger functionality on input
          onFocus={handleInput} // Trigger functionality on focus
          onPaste={(e) => {
            // Wait for paste to update textarea value, then adjust height
            setTimeout(() => {
              if (textareaRef.current) {
                // Create a synthetic ChangeEvent to reuse handleInput
                const event = {
                  ...e,
                  target: textareaRef.current,
                } as React.ChangeEvent<HTMLTextAreaElement>;
                handleInput(event);
              }
            }, 0);
          }} // Trigger functionality on paste
          value={value}
          onChange={(e) => {
            onChange(e.target.value); // Update the value in real-time
            handleInput(e); // Pass the event to handleInput for height adjustment
          }}
          placeholder="ask me anything..."
          className={styles["chat_input_textarea"]}
          onKeyUp={handleKeyPress}
          maxLength={300}
          disabled={disabled}
        />
        <div className={styles["chat_input_button_div"]}>
          <button onClick={handleSend} disabled={disabled || !value.trim()}>
            {disabled ? (
              <Image src={sendIconDisable} alt="Send" width={40} height={40} />
            ) : (
              <Image src={sendIcon} alt="Send" width={40} height={40} />
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
