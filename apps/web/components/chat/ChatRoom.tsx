"use client";

import { useEffect, useState, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { getSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { useUser } from "@/lib/redux/hooks/use-user";
import { User } from "next-auth";

export default function ChatRoom({
  roomId,
  members,
  user,
}: {
  user: User;
  roomId: string;
  members: any[]; // array of { id, name, image }
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket>(null);
  console.log("user room", user);
  useEffect(() => {
    const socket = getSocket(user.id, "/chat");
    // socket.connect();
    if (!socket.connected) {
      socket.connect();
    }

    console.log("WS connected");
    socket.on("message", (msg) => {
      if (msg.roomId === roomId) {
        setMessages((prev) => [...prev, msg]);
        console.log("got a message", msg);
      }
    });

    socket.on("typing", ({ userId, isTyping }) => {
      setTypingUsers((prev) =>
        isTyping
          ? [...new Set([...prev, userId])]
          : prev.filter((id) => id !== userId)
      );
    });
  }, [roomId]);

  return (
    <div className="flex flex-col h-full border rounded-lg bg-background">
      <ChatHeader roomId={roomId} members={members} />

      <ChatMessageList messages={messages} user={user} />

      <ChatInput
        user={user}
        members={members}
        roomId={roomId}
        socket={socketRef.current!}
      />

      {typingUsers.length > 0 && (
        <div className="px-4 py-1 text-xs text-muted-foreground">
          {typingUsers.length === 1
            ? `${
                members.find((m) => m.id === typingUsers[0])?.name
              } is typing...`
            : "Several people are typing..."}
        </div>
      )}
    </div>
  );
}
