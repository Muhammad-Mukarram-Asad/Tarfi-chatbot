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

    if(reason == 'io client disconnect') {
      // Client initiated disconnect - need to manually reconnect
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

  const closeSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  return {
    isConnected,
    sendMessage,
    closeSocket,
    socket: socketRef.current,
  };
};

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { BotMessage, parseAgentResponse } from "@/lib/types/agentResponse";

// const SOCKET_URL = "http://localhost:8000";

// type StreamHandlers = {
//   onProcessing?: (data: any) => void;
//   onAgentUpdate?: (data: any) => void;
//   onChunk?: (chunk: string, agent?: string) => void;
//   onDone?: () => void;
//   onError?: (error: any) => void;
// };

// export const useSocket = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [streamText, setStreamText] = useState("");   // live, incremental text
//   const [streamAgent, setStreamAgent] = useState<string | null>(null);

//   const socketRef = useRef<Socket | null>(null);

//   // keep stable listener refs so .off() works correctly
//   const listenersRef = useRef({
//     processing: null as ((data: any) => void) | null,
//     agent_update: null as ((data: any) => void) | null,
//     response_chunk: null as ((data: any) => void) | null,
//     response: null as ((data: any) => void) | null,
//     error: null as ((data: any) => void) | null,
//     get_stream_adapter: null as ((data: any) => void) | null,
//   });

//   useEffect(() => {
//     // reuse if already connected
//     if (socketRef.current?.connected) {
//       console.log("socket already connected, reusing", socketRef.current.id);
//       setIsConnected(true);
//       return;
//     }

//     // clean any stale socket
//     if (socketRef.current) {
//       socketRef.current.removeAllListeners();
//       socketRef.current.disconnect();
//       socketRef.current = null;
//     }

//     const s = io(SOCKET_URL, {
//       path: "/socket.io",
//       transports: ["websocket", "polling"],
//       reconnection: true,
//       reconnectionAttempts: 10,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 5000,
//       timeout: 20000,
//       autoConnect: true,
//     });

//     socketRef.current = s;

//     s.on("connect", () => {
//       console.log("✅ connected:", s.id);
//       setIsConnected(true);
//     });

//     s.on("disconnect", (reason) => {
//       console.log("❌ disconnected:", reason);
//       setIsConnected(false);
//       if (reason === "io server disconnect" || reason === "io client disconnect") {
//         s.connect();
//       }
//     });

//     s.on("connect_error", (err) => {
//       console.error("🔴 connect_error:", err.message);
//       setIsConnected(false);
//     });

//     s.on("reconnect_attempt", (n) => console.log("🔄 reconnect attempt", n));
//     s.on("reconnect", (n) => {
//       console.log("✅ reconnected after", n, "attempts");
//       setIsConnected(true);
//     });
//     s.on("reconnect_failed", () => console.error("❌ reconnect failed"));

//     // optional: wired from your server
//     s.on("connected", (d) => console.log("📝 session created:", d));
//     s.on("session_recovered", (d) => console.log("🔄 session recovered:", d));
//     s.on("pong", (d) => console.log("🏓 pong:", d));

//     return () => {
//       console.log("🧹 cleaning socket");
//       // remove our named listeners (defensive)
//       Object.entries(listenersRef.current).forEach(([evt, fn]) => {
//         if (fn && s) s.off(evt, fn as any);
//       });
//       s.removeAllListeners();
//       s.disconnect();
//     };
//   }, []);



//   /**
//    * sendMessage now accepts optional per-message stream handlers.
//    * it still resolves to a final BotMessage for your chat history.
//    */
//   const sendMessage = (
//     message: string,
//     handlers?: StreamHandlers
//   ): Promise<BotMessage> => {
//     return new Promise((resolve, reject) => {
//       const socket = socketRef.current;
//       if (!socket || !socket.connected) {
//         reject(new Error("Socket not connected"));
//         return;
//       }

//       console.log("📤 sending to server:", message);

//       // reset live stream state for this turn
//       setIsStreaming(true);
//       setStreamText("");
//       setStreamAgent(null);

//       // ------ define named handlers so we can .off() them later

//       // processing
//       const handleProcessing = (data: any) => {
//         handlers?.onProcessing?.(data);
//         // optional: show spinner etc.
//         console.log("processing:", data);
//       };

//       // agent updates (routing)
//       const handleAgentUpdate = (data: any) => {
//         setStreamAgent(data?.agent ?? data?.to_agent ?? null);
//         handlers?.onAgentUpdate?.(data);
//         console.log("agent_update:", data);
//       };

//       // streaming chunks
//       const handleResponseChunk = (data: any) => {
//         const chunk = typeof data?.chunk === "string" ? data.chunk : "";
//         console.log("response_chunk:", chunk);
//         const agent = data?.agent;
//         console.log("chunk agent:", agent);
//         if (chunk) {
//           setStreamText((prev) => prev + chunk);
//           handlers?.onChunk?.(chunk, agent);
//         }
//         if (agent) setStreamAgent(agent);
//       };

//       // final response (complete)
//       const handleResponse = (data: any) => {
//         // parse final payload to BotMessage
//         try {
//           let agentResponse: any;
//           console.log("type of data.response:", typeof data.response);
//           console.log("data.response:", data);

//           if (typeof data.response === "string") {
//             agentResponse = parseAgentResponse(data.response);
//           } else if (typeof data.response === "object") {
//             agentResponse = data.response;
//           } else {
//             throw new Error("Invalid response format from server");
//           }

//           console.log("agentResponse:", agentResponse);

//           const agentType = data?.agent || streamAgent || "general";

//           const botMessage: BotMessage = {
//             type: agentType,
//             isUser: false,
//             color: "border-b border-b-gray-300",
//             bgcolor: "bg-white",
//             agentResponse,
//           };

//           handlers?.onDone?.();
//           setIsStreaming(false);

//           cleanupListeners();
//           clearTimeout(timeout);
//           resolve(botMessage);
//         } catch (err) {
//           handleError(err);
//         }
//       };

//       // error
//       const handleError = (errorData: any) => {
//         const err =
//           errorData instanceof Error
//             ? errorData
//             : new Error(errorData?.message || errorData?.error || "Unknown error");

//         handlers?.onError?.(err);
//         setIsStreaming(false);

//         cleanupListeners();
//         clearTimeout(timeout);
//         reject(err);
//       };

//       // optional: debug/info
//       const handleStreamInfo = (data: any) => {
//         console.log("ℹ️ stream adapter info:", data);
//       };

//       // ------- register (use .on vs .once for chunks)
//       socket.on("processing", handleProcessing);
//       socket.on("agent_update", handleAgentUpdate);
//       socket.on("response_chunk", handleResponseChunk); // stream
//       socket.once("response", handleResponse);          // final
//       socket.once("error", handleError);
//       socket.on("get_stream_adapter", handleStreamInfo);

//       // keep references so we can off() in cleanup
//       listenersRef.current.processing = handleProcessing;
//       listenersRef.current.agent_update = handleAgentUpdate;
//       listenersRef.current.response_chunk = handleResponseChunk;
//       listenersRef.current.response = handleResponse;
//       listenersRef.current.error = handleError;
//       listenersRef.current.get_stream_adapter = handleStreamInfo;

//       // ------- emit user chat
//       socket.emit("chat", { message });

//       // ------- timeout guard
//       const timeout = setTimeout(() => {
//         handleError(new Error("Response timeout - server took too long to respond"));
//       }, 60000);

//       // ------- local cleanup helper
//       function cleanupListeners() {
//         if (!socket) return;
//         const l = listenersRef.current;
//         if (l.processing) socket.off("processing", l.processing);
//         if (l.agent_update) socket.off("agent_update", l.agent_update);
//         if (l.response_chunk) socket.off("response_chunk", l.response_chunk);
//         if (l.response) socket.off("response", l.response);
//         if (l.error) socket.off("error", l.error);
//         if (l.get_stream_adapter)
//           socket.off("get_stream_adapter", l.get_stream_adapter);

//         // reset refs
//         listenersRef.current = {
//           processing: null,
//           agent_update: null,
//           response_chunk: null,
//           response: null,
//           error: null,
//           get_stream_adapter: null,
//         };
//       }
//     });
//   };

//   const closeSocket = () => {
//     if (socketRef.current) {
//       // remove listeners before disconnect
//       Object.entries(listenersRef.current).forEach(([evt, fn]) => {
//         if (fn && socketRef.current) socketRef.current.off(evt, fn as any);
//       });
//       socketRef.current.disconnect();
//     }
//   };

//   return {
//     isConnected,
//     isStreaming,
//     streamText,   // live streaming text for UI
//     streamAgent,  // current agent label for UI
//     sendMessage,
//     closeSocket,
//     socket: socketRef.current,
//   };
// };
