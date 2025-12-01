"use client";

import { useEffect, useState, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { getSocket } from "@/lib/socket";

export default function ChatRoom({
  roomId,
  user,
  members,
}: {
  roomId: string;
  user: any; // { id, name, image }
  members: any[]; // array of { id, name, image }
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.emit("joinRoom", { roomId, user });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
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
        socket={socketRef.current}
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
