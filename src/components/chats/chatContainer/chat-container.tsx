"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChatHeader } from "@/components/chats/chatHeader/chat-header";
import { MessageBubble } from "@/components/chats/messageBubble/message-bubble";
import { ChatInput } from "@/components/chats/chatInput/chat-input";
import styles from "./chatContainer.module.scss";
import { HistoryScreen } from "@/components/history/side-panel";
import botIcon from "../../../../public/icons/bot-response-icon.svg";
import Image from "next/image";
import { useSocket } from "@/hooks/useSocket"; // Import the socket hook
import { Message, UserMessage, BotMessage } from "@/lib/types/agentResponse";

const suggestionsList = [
  "Tell me how to make an emergency fund?",
  "How can I buy a car at 23 years?",
  "Create a pie chart of my spending categories.",
  "Generate a bar chart comparing my income vs expenses.",
];

export function ChatContainer() {
  // const [toggleTheme, setToggleTheme] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const { isConnected, sendMessage, closeSocket } = useSocket(); // Use the custom hook for Socket.IO

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || !isConnected) return;

    // Add user message
    const userMessage: UserMessage = {
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

    try {
      // Send message to backend via Socket.IO
      // The botResponse is already a BotMessage with agentResponse parsed
      const botMessage = await sendMessage(currentInput);
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Fallback error message
      const errorMessage: BotMessage = {
        type: "general",
        isUser: false,
        color: "border-b border-b-gray-300",
        bgcolor: "bg-white",
        agentResponse: {
          response: "Sorry, I couldn't process your request. Please try again.",
          timestamp: new Date().toISOString(),
          data: {
            next_question: "How else can I help you?",
          },
        },
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleShowSidePanel = () => {
    setShowSidePanel(!showSidePanel);
  };

  const menuRef = useRef<HTMLDivElement>(null);
  const loginUserName = typeof window !== "undefined" ? window?.sessionStorage?.getItem("userName") : "User";

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

  // make a ref for automatic scrolling so that the chat container always scrolls to the bottom
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const waiting = [
    "AI is thinking",
    "Generating response...",
  ];

  const [currentMessage, setCurrentMessage] = useState<string>("");

  // Use useEffect to handle the interval logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentIndex = 0;

    if (isLoading) {
      // Set initial message
      setCurrentMessage(waiting[0]);

      // Create interval to cycle through messages
      interval = setInterval(() => {
        currentIndex =
          currentIndex === waiting.length - 1 ? 0 : currentIndex + 1;
        setCurrentMessage(waiting[currentIndex]);
      }, 10000);
    }
    // Cleanup interval on unmount or when isLoading changes
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };

    // eslint-disable-next-line
  }, [isLoading]);

  return (
    <React.Fragment>
      <div ref={menuRef}>
        {showSidePanel && (
          <HistoryScreen
            showSidePanel={showSidePanel}
            handleNewChat={() => {
              setMessages([]);
              setShowSidePanel(false);
              closeSocket();
            }}
          />
        )}
      </div>

      <main
        className={
          styles[
            // showSidePanel && toggleTheme === false
            //   ? "blur_chat_container_main_div"
            //   :  showSidePanel && toggleTheme === true ? "blur_chat_container_main_div_dark" :
            //   toggleTheme === true
            //   ? "chat_container_main_div_dark"
            //   : "chat_container_main_div"
             showSidePanel
              ? "blur_chat_container_main_div"
              : "chat_container_main_div"
          ]
        }
      >
        {/* Chat Header */}
        <ChatHeader onClick={handleShowSidePanel} />

        {/* Connection Status Indicator */}
        {!isConnected && (
          <div
            style={{
              padding: "8px",
              textAlign: "center",
              backgroundColor: "#fee",
              color: "#c00",
              fontSize: "14px",
            }}
          >
            ⚠️ Connecting to server...
          </div>
        )}

        {/* Initial Message and Suggestions */}
        {messages.length === 0 && (
          <section className={styles["initial_message_section"]}>
            <div className={styles["initial_message_container"]}>
              <p className={styles["initial_message_text"]}>
                Hi there! What can I help you with today {loginUserName}? Are you looking
                to optimize your budgets or do you want to see your overall
                finances?
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
        {messages.length > 0 && (
          <div className={styles["messages_container"]} ref={chatContainerRef}>
            <div className={styles["messages_inner_container"]}>
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}

              {isLoading && (
                <div className={styles["thinking_message"]}>
                  <Image
                    src={botIcon}
                    width={32}
                    height={32}
                    alt="bot_icon_response"
                  />
                  <p>{currentMessage} </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Input Component */}

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={isLoading || !isConnected}
        />
      </main>
    </React.Fragment>
  );
}
