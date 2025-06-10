import { useEffect, useRef, useCallback, useState } from 'react';

interface UseWebSocketOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = (event) => {
        setReadyState(WebSocket.OPEN);
        options.onOpen?.(event);
      };

      wsRef.current.onclose = (event) => {
        setReadyState(WebSocket.CLOSED);
        options.onClose?.(event);
      };

      wsRef.current.onerror = (event) => {
        options.onError?.(event);
      };

      wsRef.current.onmessage = (event) => {
        setLastMessage(event);
        options.onMessage?.(event);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }, [url, options]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    lastMessage,
    readyState,
    connect,
    disconnect,
  };
}
