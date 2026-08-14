import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "./constants";

let globalSocket: Socket | null = null;

export function getSocket(): Socket {
  if (!globalSocket) {
    globalSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    globalSocket.on("connect", () => {
      console.log("⚡ [S.H.I.E.L.D. Quantum Socket] Connected:", globalSocket?.id);
    });

    globalSocket.on("disconnect", (reason) => {
      console.log("⚠️ [S.H.I.E.L.D. Quantum Socket] Disconnected:", reason);
    });

    globalSocket.on("connect_error", (err) => {
      console.warn("⚠️ [S.H.I.E.L.D. Quantum Socket] Connection Error:", err.message);
    });
  }

  return globalSocket;
}

/**
 * React hook to listen for a real-time socket event.
 */
export function useRealtimeEvent<T = any>(
  eventName: string,
  handler: (data: T) => void
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = getSocket();

    const listener = (data: T) => {
      if (handlerRef.current) {
        handlerRef.current(data);
      }
    };

    socket.on(eventName, listener);

    return () => {
      socket.off(eventName, listener);
    };
  }, [eventName]);
}

/**
 * Emit a real-time event through the global socket.
 */
export function emitRealtimeEvent(eventName: string, payload: any) {
  const socket = getSocket();
  if (socket && socket.connected) {
    socket.emit(eventName, payload);
  }
}
