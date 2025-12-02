import { io, Socket } from "socket.io-client";

// store sockets by namespace
const sockets: Record<string, Socket> = {};

export const getSocket = (userId?: string, namespace: string = "/"): Socket => {
  if (!namespace.startsWith("/")) {
    namespace = "/" + namespace;
  }

  // if socket already exists for this namespace → return it
  if (sockets[namespace]) return sockets[namespace];

  const WEBSOCKET_URL = process.env.NEXT_PUBLIC_API_URL!;
  const fullURL = `${WEBSOCKET_URL}${namespace}`;

  console.log("Connecting to:", fullURL);

  const socket = io(fullURL, {
    withCredentials: true,
    autoConnect: true,
  });

  if (userId) {
    socket.auth = { userId };
  }

  socket.connect();

  sockets[namespace] = socket;
  return socket;
};
