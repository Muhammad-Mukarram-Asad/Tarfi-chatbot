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
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      onSend();
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);


  const handleInput = () => {
  const textarea = textareaRef.current;
  if (textarea) {
    textarea.style.height = '40px'; // reset to min-height
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`; // auto-grow up to max
  }
};

  return (
    <main
      className={styles["chat_input_main_div"]}
    >
      <div className={styles["chat_input_textarea_div"]}>
        <textarea
          ref={textareaRef}
          onInput={handleInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask me anything..."
          className={styles["chat_input_textarea"]}
          onKeyUp={handleKeyPress}
          maxLength={300}
          disabled={disabled}
        />
        <div className={styles["chat_input_button_div"]}>
          <button onClick={onSend} disabled={disabled || !value.trim()}>
            {
              disabled ? <Image src={sendIconDisable} alt="Send" width={32} height={32} /> :
            <Image src={sendIcon} alt="Send" width={32} height={32} />
            }
          </button>
        </div>
      </div>
    </main>
  );
}
