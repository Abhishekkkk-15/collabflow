"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "lib/socket";
import { Socket } from "socket.io-client";

const socketContext = createContext<any>(null);

export const useSocket = () => useContext(socketContext);

type TScoketProp = {
  userId?: string;
  children: React.ReactNode;
};
export default function SocketProvider({ userId, children }: TScoketProp) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;
    const s = getSocket(userId);

    s.auth = { userId };

    s.connect();

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [userId]);

  return (
    <socketContext.Provider value={socket}>{children}</socketContext.Provider>
  );
}
