/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { BotMessage, parseAgentResponse } from "@/lib/types/agentResponse";

const SOCKET_URL = "http://localhost:8000";

export const useSocket = () => {
const [isConnected, setIsConnected] = useState(false);
const socketRef = useRef<Socket | null>(null);

useEffect(() => {
  // If socket already exists and is connected, don't create a new one
  if (socketRef.current?.connected) {
    console.log("Socket already connected, reusing existing connection");
    return;
  }

  // If socket exists but is disconnected, clean it up first
  if (socketRef.current) {
    console.log("Cleaning up disconnected socket before creating new one");
    socketRef.current.removeAllListeners();
    socketRef.current.disconnect();
    socketRef.current = null;
  }

  // Initialize socket with recovery enabled
  socketRef.current = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
  });

  const socket = socketRef.current;

  // Connection event handlers
  socket.on("connect", () => {
    console.log("✅ Connected to server:", socket.id);
    setIsConnected(true);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Disconnected. Reason:", reason);
    setIsConnected(false);
    // Handle specific disconnect reasons
    if (reason === 'io server disconnect') {
      // Server initiated disconnect - need to manually reconnect
      socket.connect();
    }
  });

  socket.on("connect_error", (error) => {
    console.error("🔴 Connection error:", error.message);
    setIsConnected(false);
  });

  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log("🔄 Reconnection attempt #", attemptNumber);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("✅ Reconnected after", attemptNumber, "attempts");
    setIsConnected(true);
  });

  socket.on("reconnect_failed", () => {
    console.error("❌ Reconnection failed after all attempts");
  });

  // Session management events
  socket.on("connected", (data) => {
    console.log("📝 Session created:", data);
  });

  socket.on("session_recovered", (data) => {
    console.log("🔄 Session recovered:", data);
  });

  // Health check
  socket.on("pong", (data) => {
    console.log("🏓 Pong received:", data);
  });

  // Error handling
  socket.on("error", (error) => {
    console.error("⚠️ Server error:", error);
  });

  // get stream adapter info
  socket.on("get_stream_adapter", (data) => {
    console.log("ℹ️ Stream adapter info:", data);
  });

  // Cleanup
  return () => {
    console.log("🧹 Cleaning up socket connection");
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      // Don't set socketRef.current to null here - let it persist
    }
  };
}, []);

  const sendMessage = (message: string): Promise<BotMessage> => {
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
        console.log("📩 Received raw response from Hyku:", data);

        try {
          // Assuming backend sends: { agent: "goal", response: "{...json...}", session_id: "..." }
          let agentResponse;
          
          if (typeof data.response === "string") {
            // Response is a JSON string, parse it
            agentResponse = parseAgentResponse(data.response);
          } else if (typeof data.response === "object") {
            // Response is already an object
            agentResponse = data.response;
          } else {
            // Fallback for unexpected format
            throw new Error("Invalid response format from server");
          }

          // Create the BotMessage with the parsed agent response
          const botMessage: BotMessage = {
            type: data?.agent || "general", // Agent type from backend (goal, budget, debt, etc.)
            isUser: false,
            color: "border-b border-b-gray-300",
            bgcolor: "bg-white",
            agentResponse: agentResponse, // This contains response, data, timestamp
          };

          console.log("✅ Final bot message:", botMessage);

          // Clean up listeners
          socket.off("processing", handleProcessing);
          socket.off("agent_update", handleAgentUpdate);
          socket.off("response", handleResponse);
          socket.off("error", handleError);
         socket.off("get_stream_adapter", (data) => {
        console.log("ℹ️ Stream adapter info:", data);
      });

          clearTimeout(timeout);
          resolve(botMessage);
        } catch (error) {
          console.error("🔴 Error parsing response:", error);

          // Clean up listeners
          socket.off("processing", handleProcessing);
          socket.off("agent_update", handleAgentUpdate);
          socket.off("response", handleResponse);
          socket.off("error", handleError);
          socket.off("get_stream_adapter", (data) => {
        console.log("ℹ️ Stream adapter info:", data);
      });

          clearTimeout(timeout);
          reject(error);
        }
      };

      const handleError = (errorData: any) => {
        console.error("🔴 Received error:", errorData);

        // Clean up listeners
        socket.off("processing", handleProcessing);
        socket.off("agent_update", handleAgentUpdate);
        socket.off("response", handleResponse);
        socket.off("error", handleError);
        socket.off("get_stream_adapter", (data) => {
        console.log("ℹ️ Stream adapter info:", data);
      });

        clearTimeout(timeout);
        reject(new Error(errorData.message || errorData.error || "Unknown error"));
      };

      // Add event listeners
      socket.on("processing", handleProcessing);
      socket.on("agent_update", handleAgentUpdate);
      socket.once("response", handleResponse);
      socket.once("error", handleError);
      socket.on("get_stream_adapter", (data) => {
        console.log("ℹ️ Stream adapter info:", data);
      });

      // Handle timeout
      const timeout = setTimeout(() => {
        console.error("⏱️ Response timeout after 60 seconds");

        // Clean up listeners
        socket.off("processing", handleProcessing);
        socket.off("agent_update", handleAgentUpdate);
        socket.off("response", handleResponse);
        socket.off("error", handleError);
        socket.off("get_stream_adapter", (data) => {
        console.log("ℹ️ Stream adapter info:", data);
      });

        reject(new Error("Response timeout - server took too long to respond"));
      }, 60000);
    });
  };

  return {
    isConnected,
    sendMessage,
    socket: socketRef.current,
  };
};