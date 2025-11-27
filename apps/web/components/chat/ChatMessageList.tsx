// components/chat/ChatMessageList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import type { ChatMessage as CM, ChatUser } from "./types";
import { getSocket } from "@/lib/socket";

export default function ChatMessageList({
  roomId,
  user,
  members,
  socketUrl,
  loadMore,
  pageSize = 30,
  onOpenThread,
}: {
  roomId: string;
  user: ChatUser;
  members: ChatUser[];
  socketUrl?: string;
  loadMore?: (opts: { beforeMessageId?: string }) => Promise<CM[]>;
  pageSize?: number;
  onOpenThread?: (m: CM) => void;
}) {
  const [messages, setMessages] = useState<CM[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (socketUrl) getSocket();
    const s = (window as any).__socket; // fallback, but we use createSocket to expose

    // join room using global socket
    try {
      const sock = awaitImportSocket(socketUrl)();
      sock.emit("join_room", roomId);
      sock.on("receive_message", (m: CM) =>
        setMessages((prev) => [...prev, m])
      );
      sock.on("message_updated", (m: CM) =>
        setMessages((prev) => prev.map((x) => (x.id === m.id ? m : x)))
      );
      sock.on("message_deleted", (id: string) =>
        setMessages((prev) => prev.filter((x) => x.id !== id))
      );
    } catch (e) {
      // noop
    }

    return () => {
      try {
        const sock = awaitImportSocket(socketUrl)();
        sock.emit("leave_room", roomId);
        sock.off("receive_message");
        sock.off("message_updated");
        sock.off("message_deleted");
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, socketUrl]);

  // helper to lazy-import or return socket
  function awaitImportSocket(url?: string) {
    return () => {
      try {
        return getSocket();
      } catch {
        return getSocket();
      }
    };
  }

  // infinite scroll: when scrollTop < 200 => load older
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    function onScroll() {
      if (el!.scrollTop < 200 && !isLoadingMore && hasMore && loadMore) {
        setIsLoadingMore(true);
        const before = messages[0]?.id;
        loadMore({ beforeMessageId: before })
          .then((older) => {
            if (!older || older.length === 0) setHasMore(false);
            setMessages((prev) => [...older, ...prev]);
          })
          .finally(() => setIsLoadingMore(false));
      }
    }
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [loadMore, messages, isLoadingMore, hasMore]);

  // handlers from message child
  function handleReact(msgId: string, emoji: string) {
    const sock = getSocket();
    sock.emit("react", { roomId, msgId, emoji });
  }

  function handleEdit(msgId: string, newText: string) {
    const sock = getSocket();
    sock.emit("edit_message", { roomId, msgId, newText });
  }

  function handleDelete(msgId: string) {
    const sock = getSocket();
    sock.emit("delete_message", { roomId, msgId });
  }

  return (
    <div
      ref={scroller}
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
      {isLoadingMore && (
        <div className="text-center text-sm text-muted-foreground">
          Loading...
        </div>
      )}
      {messages.map((m) => (
        <ChatMessage
          key={m.id}
          message={m}
          meUserId={user.id}
          onReact={handleReact}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onOpenThread={onOpenThread || (() => {})}
        />
      ))}
    </div>
  );
}
