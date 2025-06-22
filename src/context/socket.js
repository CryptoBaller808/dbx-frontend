import { createContext, useContext } from "react";
import { io } from "socket.io-client";
import { LOCAL_SOCKET_SERVER } from "../config";

export const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const socket = io(LOCAL_SOCKET_SERVER, { transports: ["websocket"], secure: true });
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
