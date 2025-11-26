import { io } from "socket.io-client";

let socket: ReturnType<typeof io> | null = null;

export const getSocket = (userId?: string) => {
  if (socket) return socket;

  socket = io(process.env.NEXT_PUBLIC_API_URL!, {
    withCredentials: true,
    autoConnect: false,
  });

  if (userId) {
    socket.auth = { userId };
  }

  socket.connect();

  return socket;
};
