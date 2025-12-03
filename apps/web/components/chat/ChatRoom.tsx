"use client";

import { useEffect, useState, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { getSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { useUser } from "@/lib/redux/hooks/use-user";
import { User } from "next-auth";
import { useSocket } from "../providers/SocketProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

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
  console.log("user room", user);
  const socket = useSocket();
  useEffect(() => {
    if (!socket) {
      console.log("Socket is null");
      return;
    }

    socket.emit("joinRoom", { roomId });

    console.log("WS connected");
    socket.on("message", (msg: any) => {
      if (msg.roomId === roomId) {
        setMessages((prev) => [...prev, msg]);
        console.log("got a message", msg);
      }
    });

    socket.on(
      "typing",
      ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
        if (userId === user.id) return;
        setTypingUsers((prev) =>
          isTyping
            ? [...new Set([...prev, userId])]
            : prev.filter((id) => id !== userId)
        );
        console.log("typing", userId, isTyping);
      }
    );
    return () => {
      socket.off("joinRoom");
    };
  }, [roomId]);

  return (
    <div className="flex flex-col h-full border rounded-lg bg-background">
      <ChatHeader roomId={roomId} members={members} />

      <ChatMessageList messages={messages} user={user} />
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground">
          {typingUsers.length === 1 ? (
            <>
              <div className="flex items-center rounded-4xl">
                <Avatar className="h-6 w-6 rounded-4xl">
                  <AvatarImage
                    src={
                      members.find((m) => m.user.id === typingUsers[0])?.user
                        .image
                    }
                    className="h-6 w-6 rounded-4xl"
                  />
                  <AvatarFallback>
                    {
                      members.find((m) => m.user.id === typingUsers[0])?.user
                        .name?.[0]
                    }
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex items-center gap-1">
                <span className="font-medium">
                  {members.find((m) => m.user.id === typingUsers[0])?.user.name}
                </span>
                <TypingDots />
              </div>
            </>
          ) : (
            <>
              <div className="flex -space-x-2 items-center justify-center">
                {typingUsers.slice(0, 3).map((id) => {
                  const u = members.find((m) => m.user.id === id)?.user;
                  return (
                    <Avatar
                      key={id}
                      className="h-6 w-6 border rounded-4xl flex items-center justify-center ">
                      <AvatarImage src={u?.image} className="rounded-4xl" />
                      <AvatarFallback>{u?.name?.[0]}</AvatarFallback>
                    </Avatar>
                  );
                })}
                {typingUsers.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] border">
                    +{typingUsers.length - 3}
                  </div>
                )}
              </div>

              <TypingDots />
            </>
          )}
        </div>
      )}

      <ChatInput
        user={user}
        members={members}
        roomId={roomId}
        socket={socket!}
      />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 ml-1">
      <span className="w-1.5 h-1.5 bg-muted-foreground/70 rounded-full animate-bounce [animation-delay:-0.2s]" />
      <span className="w-1.5 h-1.5 bg-muted-foreground/70 rounded-full animate-bounce [animation-delay:-0.1s]" />
      <span className="w-1.5 h-1.5 bg-muted-foreground/70 rounded-full animate-bounce" />
    </div>
  );
}
