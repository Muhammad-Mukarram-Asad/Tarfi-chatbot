"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChatHeader } from "@/components/chats/chatHeader/chat-header";
import { MessageBubble } from "@/components/chats/messageBubble/message-bubble";
import {
  // LoadingBubble,
  LoadingBubble2,
  // LoadingBubble3,
  // LoadingBubble4,
} from "@/components/chats/loadingAnimation/loading-bubble";
import { ChatInput } from "@/components/chats/chatInput/chat-input";
import styles from "./chatContainer.module.scss";
import { HistoryScreen } from "@/components/history/side-panel";

interface Message {
  // id: number;
  type: "text" | "table" | "line-chart" | "bar-chart" | "loading" | "merchant";
  content?: string;
  isUser: boolean;
  color: string;
  bgcolor: string;
}

const suggestionsList = [
  "Show me a table of my monthly expenses.",
  "Tell me how to make an emergency fund?",
  "How can I buy a car at 23 years?",
  "What is the best way to save for retirement?",
];

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      // id: nextId(),
      type: "text",
      content: inputValue,
      isUser: true,
      color: "border-b border-b-gray-300",
      bgcolor: "bg-white",
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setIsLoading(false);

      // Determine response type based on input
      let responseMessage: Message;
      if (
        currentInput.toLowerCase().includes("table") ||
        currentInput.toLowerCase().includes("data")
      ) {
        responseMessage = {
          // id: nextId()+ 1,
          type: "table",
          isUser: false,
          color: "border-b border-b-gray-300",
          bgcolor: "bg-white",
        };
      } else if (
        currentInput.toLowerCase().includes("line") ||
        currentInput.toLowerCase().includes("trend")
      ) {
        responseMessage = {
          // id: nextId() + 1,
          type: "line-chart",
          isUser: false,
          color: "border-b border-b-gray-300",
          bgcolor: "bg-white",
        };
      } else if (
        currentInput.toLowerCase().includes("bar") ||
        currentInput.toLowerCase().includes("compare")
      ) {
        responseMessage = {
          // id: nextId() + 1,
          type: "bar-chart",
          isUser: false,
          color: "border-b border-b-gray-300",
          bgcolor: "bg-white",
        };
      } else if (
        currentInput.toLowerCase().includes("merchant") ||
        currentInput.toLowerCase().includes("vendor")
      ) {
        responseMessage = {
          // id: nextId() + 1,
          type: "merchant",
          isUser: false,
          color: "border-b border-b-gray-300",
          bgcolor: "bg-white",
        };
      } else {
        responseMessage = {
          // id: nextId() + 1,
          type: "text",
          // content:
          //   "I can help you with various data visualizations including tables, line charts, and bar charts. Just let me know what type of analysis you need!",
          content:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
          isUser: false,
          color: "border-b border-b-gray-300",
          bgcolor: "bg-white",
        };
      }

      setMessages((prev) => [...prev, responseMessage]);
    }, 2000);
  };

  const handleShowSidePanel = () => {
    setShowSidePanel(!showSidePanel);
  };

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowSidePanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <React.Fragment>
      <div ref={menuRef}>
        {showSidePanel && (
          <HistoryScreen
            showSidePanel={showSidePanel}
            handleNewChat={() => {
              setMessages([]);
              setShowSidePanel(false);
            }}
          />
        )}
      </div>

      <main
        className={styles[showSidePanel ? "blur_chat_container_main_div" : "chat_container_main_div"]}
      >
        {/* Chat Header */}
        <ChatHeader onClick={handleShowSidePanel} />

        {/* Initial Message and Suggestions */}
        {messages.length === 0 && (
          <section className={styles["initial_message_section"]}>
            <div className={styles["initial_message_container"]}>
              <p className={styles["initial_message_text"]}>
                Hi there! What can I help you with today Sara? Are you looking
                to optimize your budgets or do you want to see your overall
                finances
              </p>
            </div>

            <div className={styles["suggestions_container"]}>
              {suggestionsList?.map((suggestion, index) => (
                <p
                  key={index}
                  className={styles["suggestion_item"]}
                  onClick={() => setInputValue(suggestion)}
                >
                  {suggestion}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Messages */}
        {messages.length > 1 && (
          <div className={styles["messages_container"]}>
            <div className={styles["messages_inner_container"]}>
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
              {isLoading && <LoadingBubble2 />}
            </div>
          </div>
        )}

        {/* Chat Input Component */}

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={isLoading}
        />
      </main>
    </React.Fragment>
  );
}
