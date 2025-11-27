// components/chat/Chat.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";
import ThreadPanel from "./ThreadPanel";
import type { ChatUser, ChatMessage } from "./types";
import { getSocket } from "@/lib/socket";

const MOCKET_MESSAGES = {};

export default function Chat({
  roomId,
  user,
  members,
  socketUrl = "http://localhost:3001",
  loadMore,
  pageSize = 30,
}: {
  roomId: string;
  user: ChatUser;
  members: ChatUser[];
  socketUrl?: string;
  loadMore?: (opts: { beforeMessageId?: string }) => Promise<ChatMessage[]>;
  pageSize?: number;
}) {
  // socket
  const [socketInit, setSocketInit] = useState(false);
  const [typingUsers, setTypingUsers] = useState<
    { id: string; name: string }[]
  >([]);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [threadRoot, setThreadRoot] = useState<ChatMessage | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const sock = getSocket();
    socketRef.current = sock;

    // standard events
    sock.on("connect", () => setSocketInit(true));
    sock.on("online_users", (list: ChatUser[]) => setOnlineUsers(list));
    sock.on("user_typing", (payload: { userId: string; name: string }) => {
      setTypingUsers((prev: any) => {
        if (prev.find((p: any) => p.id === payload.userId)) return prev;
        return [...prev, payload];
      });
      window.setTimeout(() => {
        setTypingUsers((prev) => prev.filter((p) => p.id !== payload.userId));
      }, 2000);
    });

    // join room
    sock.emit("join_room", roomId);

    return () => {
      sock.emit("leave_room", roomId);
      sock.off("connect");
      sock.off("online_users");
      sock.off("user_typing");
    };
  }, [roomId, socketUrl]);

  // send message
  function handleSend(payload: {
    text: string;
    mentions?: any[];
    files?: File[];
  }) {
    const msg = {
      id: `local-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: payload.text,
      mentions: payload.mentions,
      files: payload.files
        ? payload.files.map((f, i) => ({
            id: `file-${Date.now()}-${i}`,
            name: f.name,
            url: undefined,
            type: f.type,
          }))
        : undefined,
      reactions: [],
      createdAt: new Date().toISOString(),
      readBy: [user.id],
    } as ChatMessage;

    // optimistic emit
    const sock = socketRef.current;
    sock.emit("send_message", { roomId, message: msg }, (ack: any) => {
      // backend ack may return message with id/url data; ideally update local list (handled in ChatMessageList via socket event)
    });
  }

  function handleTyping(isTyping = true) {
    const sock = socketRef.current;
    if (!sock) return;
    sock.emit("typing", { roomId, userId: user.id, name: user.name });
  }

  // open thread
  function openThread(m: ChatMessage) {
    setThreadRoot(m);
  }

  return (
    <div className="flex h-full bg-background border rounded">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 min-h-0">
          <ChatMessageList
            roomId={roomId}
            user={user}
            members={members}
            socketUrl={socketUrl}
            loadMore={loadMore}
            pageSize={pageSize}
            onOpenThread={openThread}
          />
        </div>

        {/* typing + online indicator */}
        <div className="px-4 py-2 border-t text-sm text-muted-foreground flex items-center gap-3">
          <div className="flex gap-2 items-center">
            {typingUsers.length > 0 ? (
              <div className="text-xs italic">
                {typingUsers.map((t) => t.name).join(", ")} is typing…
              </div>
            ) : (
              <div className="text-xs">
                Active — {onlineUsers.length} online
              </div>
            )}
          </div>
        </div>

        <ChatInput
          user={user}
          members={members}
          onSend={handleSend}
          onTyping={() => handleTyping(true)}
        />
      </div>

      {/* Thread panel */}
      {threadRoot && (
        <ThreadPanel
          rootMessage={threadRoot}
          onClose={() => setThreadRoot(null)}
          onSendThread={(payload) => {
            // send thread message
            const sock = socketRef.current;
            sock.emit("send_thread_message", {
              roomId,
              rootId: threadRoot.id,
              payload,
            });
          }}
          user={user}
          members={members}
        />
      )}
    </div>
  );
}
