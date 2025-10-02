/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

interface Message {
  type: string;
  content?: { response: string; agent: string; sessionId: string };
  isUser: boolean;
  color: string;
  bgcolor: string;
}

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const isInitialized = useRef(false); // Track if socket is already initialized

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current) {
      return;
    }

    // Initialize socket connection only once
    socketRef.current = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true, // Auto-connect on initialization
    });

    const socket = socketRef.current;
    isInitialized.current = true; // Mark as initialized

    // Connection event handlers
    socket.on("connect", () => {
      console.log("✅ Connected to Hyku server:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server. Reason:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("🔴 Connection error:", error.message);
      setIsConnected(false);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Reconnected to server after", attemptNumber, "attempts");
      setIsConnected(true);
    });

    socket.on("ping", () => {
      console.log("🏓 Ping received from server");
    });

    // Cleanup on unmount (only when component unmounts completely)
    return () => {
      console.log("🧹 Cleaning up socket connection");
      if (socket.connected) {
        socket.disconnect();
      }
      socketRef.current = null;
      isInitialized.current = false;
    };

  
  }, []); // Empty dependency array ensures this runs only once

  // Send message to the server
  const sendMessage = (message: string): Promise<Message> => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current || !socketRef.current.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      console.log("📤 Sending message to Hyku:", message);

      const socket = socketRef.current;

      // Send message to server
      socket.emit("chat", { message: message });

      // Listeners for events
      const handleProcessing = (data: any) => {
        console.log("📩 Received processing event from Hyku:", data);
      };

      const handleAgentUpdate = (data: any) => {
        console.log("📩 Received agent_update event from Hyku:", data);
      };

      const handleResponse = (data: any) => {
          console.log("📩 Received response from Hyku:", data);

          // Transform backend response to your Message format
          const botMessage: Message = {
            type: data?.agent, // Use agent type from backend
            content: data,
            isUser: false,
            color: "border-b border-b-gray-300",
            bgcolor: "bg-white",
          };

          resolve(botMessage);
          clearTimeout(timeout); // Clear timeout on response
        };

      // const handleResponse = (data: any) => {
      //   console.log("📩 Received response from Hyku:", data);

      //   // Parse response if it's JSON string
      //   let responseText = data.response || "";
      //   let nextQuestion = "";

      //   try {
      //     if (typeof data.response === "string") {
      //       const parsedResponse = JSON.parse(data.response);
      //       responseText = parsedResponse.response || data.response;
      //       nextQuestion = parsedResponse.next_question || "";
      //     }
      //   } catch (e) {
      //     // Response is not JSON, use as-is
      //     responseText = data.response || "";
      //   }

      //   // Format content with line breaks and bold text
      //   const formattedContent = nextQuestion
      //     ? `${responseText}\n\n**Next Question:** ${nextQuestion}`
      //     : responseText;

      //   // Transform backend response to Message format
      //   const botMessage: Message = {
      //     type: data?.agent || "general",
      //     content: {
      //       response: formattedContent,
      //       agent: data?.agent || "general",
      //       sessionId: data?.session_id || "",
      //     },
      //     isUser: false,
      //     color: "border-b border-b-gray-300",
      //     bgcolor: "bg-white",
      //   };

      //   // Clean up listeners
      //   socket.off("processing", handleProcessing);
      //   socket.off("agent_update", handleAgentUpdate);
      //   socket.off("response", handleResponse);
      //   socket.off("error", handleError);

      //   clearTimeout(timeout);
      //   resolve(botMessage);
      // };

      const handleError = (errorData: any) => {
        console.error("🔴 Received error:", errorData);

        // Clean up listeners
        socket.off("processing", handleProcessing);
        socket.off("agent_update", handleAgentUpdate);
        socket.off("response", handleResponse);
        socket.off("error", handleError);

        clearTimeout(timeout);
        reject(new Error(errorData.message || errorData.error || "Unknown error"));
      };

      // Add event listeners
      socket.on("processing", handleProcessing);
      socket.on("agent_update", handleAgentUpdate);
      socket.once("response", handleResponse); // Use 'once' to auto-remove after first call
      socket.once("error", handleError);

      // Handle timeout
      const timeout = setTimeout(() => {
        console.error("⏱️ Response timeout after 60 seconds");

        // Clean up listeners
        socket.off("processing", handleProcessing);
        socket.off("agent_update", handleAgentUpdate);
        socket.off("response", handleResponse);
        socket.off("error", handleError);

        reject(new Error("Response timeout - server took too long to respond"));
      }, 60000); // 60 second timeout
    });
  };

  return {
    isConnected,
    sendMessage,
    socket: socketRef.current,
  };
};