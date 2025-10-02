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

interface Message extends Bubble {
  // type: "text" | "table" | "line-chart" | "bar-chart" | "loading" | "merchant";
  type: string;
  content?: string;
}

interface Bubble {
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
  // Initialize socket connection
  const { isConnected, sendMessage } = useSocket();

  // const handleSend = () => {
  //   if (!inputValue.trim() || isLoading) return;

  //   // Add user message
  //   const userMessage: Message = {
  //     type: "text",
  //     content: inputValue,
  //     isUser: true,
  //     color: "border-b border-b-gray-300",
  //     bgcolor: "bg-white",
  //   };

  //   setMessages((prev) => [...prev, userMessage]);
  //   const currentInput = inputValue;
  //   setInputValue("");
  //   setIsLoading(true);

  //   // Simulate AI response
  //   setTimeout(() => {
  //     setIsLoading(false);

  //     // Determine response type based on input
  //     let responseMessage: Message;
  //     if (
  //       currentInput.toLowerCase().includes("table") ||
  //       currentInput.toLowerCase().includes("data")
  //     ) {
  //       responseMessage = {
  //         type: "table",
  //         isUser: false,
  //         color: "border-b border-b-gray-300",
  //         bgcolor: "bg-white",
  //       };
  //     } else if (
  //       currentInput.toLowerCase().includes("line") ||
  //       currentInput.toLowerCase().includes("trend")
  //     ) {
  //       responseMessage = {
  //         type: "line-chart",
  //         isUser: false,
  //         color: "border-b border-b-gray-300",
  //         bgcolor: "bg-white",
  //       };
  //     } else if (
  //       currentInput.toLowerCase().includes("bar") ||
  //       currentInput.toLowerCase().includes("compare")
  //     ) {
  //       responseMessage = {
  //         type: "bar-chart",
  //         isUser: false,
  //         color: "border-b border-b-gray-300",
  //         bgcolor: "bg-white",
  //       };
  //     } else if (
  //       currentInput.toLowerCase().includes("merchant") ||
  //       currentInput.toLowerCase().includes("vendor")
  //     ) {
  //       responseMessage = {
  //         type: "merchant",
  //         isUser: false,
  //         color: "border-b border-b-gray-300",
  //         bgcolor: "bg-white",
  //       };
  //     } else {
  //       responseMessage = {
  //         type: "text",
  //         // content:
  //         //   "I can help you with various data visualizations including tables, line charts, and bar charts. Just let me know what type of analysis you need!",
  //         content:
  //           "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
  //         isUser: false,
  //         color: "border-b border-b-gray-300",
  //         bgcolor: "bg-white",
  //       };
  //     }

  //     setMessages((prev) => [...prev, responseMessage]);
  //   }, 5000);
  // };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || !isConnected) return;

    // Add user message
    const userMessage: Message = {
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
      const botResponse = await sendMessage(currentInput);
      const parsedBotResponse = JSON.parse(
        botResponse?.content?.response as string
      );
      console.log("Bot response data :", botResponse);
      console.log("Parsed response => ", parsedBotResponse);
      // console.log("Parsed response => ", parsedBotResponse?.response);
      // console.log("Parsed response next question  => ", parsedBotResponse?.next_question);

      // Format the content
      const botFormattedResponse = {
        type: botResponse?.type,
        content: `${parsedBotResponse?.response}\n\nNext Question: ${parsedBotResponse?.next_question}`,
        isUser: botResponse?.isUser,
        color: "border-b border-b-gray-300",
        bgcolor: "bg-white",
      };

      console.log("formatted bot response ", botFormattedResponse);

      // Add bot response to messages
      setMessages((prev) => [...prev, botFormattedResponse]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Fallback error message
      const errorMessage: Message = {
        type: "text",
        content: "Sorry, I couldn't process your request. Please try again.",
        isUser: false,
        color: "border-b border-b-gray-300",
        bgcolor: "bg-white",
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
    "Thinking...",
    "Analyzing...",
    "Processing...",
    "Giving you results...",
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
      }, 1250);
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
            }}
          />
        )}
      </div>

      <main
        className={
          styles[
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
