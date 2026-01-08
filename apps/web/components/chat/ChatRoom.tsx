"use client";

import { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { ChatPageResponse, useChats } from "@/hooks/useChats";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../providers/SocketProvider";
import { User } from "next-auth";
import { useMembers } from "@/lib/api/common/useMembers";
import { CollabFlowLoader } from "../loaders/CollabFlowLoader";
import { Spinner } from "../ui/spinner";

export default function ChatRoom({
  roomId,
  user,
}: {
  user: User;
  roomId: string;
}) {
  const [path, slug] = roomId.split(":") as ["workspace" | "project", string];
  const socket = useSocket();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const { data: m = { members: [] }, isLoading } = useMembers({
    path: path == "workspace" ? "WORKSPACE" : "PROJECT",
    slug,
    query,
    limit: 10,
  });
  console.log("c", m);
  const [page, setPage] = useState(1);

  const { data, isFetching } = useChats(roomId, page);
  const members = m!.members ?? [];

  const messages = data?.messages ?? [];
  const totalPages = data?.totalPages ?? 1;
  const hasNextPage = page < totalPages;
  useEffect(() => {
    if (!data?.messages) return;

    setAllMessages((prev) => {
      const map = new Map();

      [...data.messages, ...prev].forEach((msg) => {
        const key = msg.clientMessageId || msg.id;
        map.set(key, msg);
      });

      return Array.from(map.values()).sort(
        (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)
      );
    });
  }, [data?.messages]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", { roomId });

    const onMessage = (msg: any) => {
      const normalized = {
        id: msg.id ?? msg.clientMessageId,
        clientMessageId: msg.clientMessageId,
        content: msg.content ?? msg.text,
        sender: msg.sender ?? msg.user,
        createdAt: msg.createdAt ?? new Date().toISOString(),
      };

      queryClient.setQueryData<ChatPageResponse>(
        ["chats", roomId, page],
        (old: any) => {
          if (!old) return old;

          const exists = old.messages.some(
            (m: any) =>
              (m.clientMessageId &&
                m.clientMessageId === normalized.clientMessageId) ||
              m.id === normalized.id
          );

          if (exists) return old;

          return {
            ...old,
            messages: [...old.messages, normalized],
          };
        }
      );
    };

    socket.on("message", onMessage);

    return () => {
      socket.off("message", onMessage);
    };
  }, [socket, roomId, page, queryClient]);
  if (isFetching)
    return (
      <div className="flex justify-center py-3">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-col h-full border rounded-lg bg-background">
      <ChatHeader roomId={roomId} members={members!} />

      <ChatMessageList
        messages={allMessages}
        user={user}
        hasNextPage={hasNextPage}
        isFetching={isFetching}
        onLoadMore={() => hasNextPage && setPage((p) => p + 1)}
        roomId={roomId}
      />

      <ChatInput
        setQuery={setQuery}
        user={user}
        members={members}
        roomId={roomId}
        socket={socket!}
        isLoading={isLoading}
      />
    </div>
  );
}
