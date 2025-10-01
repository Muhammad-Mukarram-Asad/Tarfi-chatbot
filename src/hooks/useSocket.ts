/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000';

interface Message {
  type: "text" | "table" | "line-chart" | "bar-chart" | "loading" | "merchant";
  content?: string;
  isUser: boolean;
  color: string;
  bgcolor: string;
}

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ Connected to Hyku server:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    socket.on('ping', () => {
      console.log('🏓 Ping received from server');
    });

    socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    setIsConnected(false);
  });

    // Cleanup on unmount
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  // Send message to the server
  const sendMessage = (message: string): Promise<Message> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && socketRef.current.connected) {
        console.log('📤 Sending message to Hyku:', message);

        socketRef.current.on('reconnect', () => {
  console.log('Reconnected to the server');
});

socketRef.current.on('reconnect_error', (error) => {
  console.error('Reconnection error:', error);
});
        // Send message to server
        socketRef.current.emit('chat', { message: message });

        // Listeners for events
        const handleProcessing = (data: any) => {
          console.log('📩 Received processing event from Hyku:', data);
        };

        const handleAgentUpdate = (data: any) => {
          console.log('📩 Received agent_update event from Hyku:', data);
        };

        const handleResponse = (data: any) => {
          console.log('📩 Received response from Hyku:', data);

           // Extract response content (string only)
        const responseContent = typeof data === 'string' ? data : data.response || 'No response';


          // Transform backend response to your Message format
          const botMessage: Message = {
            type: "text",
            content: responseContent,
            isUser: false,
            color: "border-b border-b-gray-300",
            bgcolor: "bg-white",
          };

          resolve(botMessage);
          clearTimeout(timeout); // Clear timeout on response
        };

        // Add event listeners
        socketRef.current.on('processing', handleProcessing);
        socketRef.current.on('agent_update', handleAgentUpdate);
        socketRef.current.once('response', handleResponse);

        socketRef.current.on('error', (errorData) => {
  console.error('Received error:', errorData);
  alert(`Error occurred: ${errorData.error}`);
  // Handle reconnection attempt here, if needed
    reject(new Error(errorData.error || 'Unknown error'));

});


        // Handle timeout (optional)
        const timeout = setTimeout(() => {
          reject(new Error('Response timeout'));
          // Remove event listeners if timeout occurs
          socketRef.current?.off('processing', handleProcessing);
          socketRef.current?.off('agent_update', handleAgentUpdate);
          socketRef.current?.off('response', handleResponse);
          socketRef.current?.off('error');
        }, 30000); // 30 second timeout
        
      } else {
        reject(new Error('Socket not connected'));
      }
    });
  };

  return {
    isConnected,
    sendMessage,
    socket: socketRef.current,
  };
};
