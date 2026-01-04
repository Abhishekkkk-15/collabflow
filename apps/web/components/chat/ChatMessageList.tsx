import { useEffect, useRef } from "react";
import ChatMessageItem from "./ChatMessageItem";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/api";

export default function ChatMessageList({
  messages,
  user,
  onLoadMore,
  isFetching,
  hasNextPage,
  roomId,
}: {
  messages: any[];
  user: any;
  onLoadMore: () => void;
  isFetching: boolean;
  hasNextPage: boolean;
  roomId: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasMarkedReadRef = useRef(false);

  const loadingOlderRef = useRef(false);
  async function markAsRead(roomKey: string) {
    await api.patch(`/chat/read/${roomKey}`);
  }
  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasMarkedReadRef.current) {
          hasMarkedReadRef.current = true;
          markAsRead(roomId);
        }
      },
      {
        threshold: 1.0,
      }
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [messages.length]);
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.sender?.id !== user.id) {
      hasMarkedReadRef.current = false;
    }
  }, [messages, user.id]);

  useEffect(() => {
    if (loadingOlderRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      80;

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!isFetching) {
      loadingOlderRef.current = false;
    }
  }, [isFetching]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {hasNextPage && (
        <div className="flex justify-center sticky top-0 z-10 bg-background/80 backdrop-blur py-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={isFetching}
            className="text-muted-foreground"
            onClick={() => {
              loadingOlderRef.current = true;
              onLoadMore();
            }}>
            {isFetching ? "Loading…" : "Load older messages"}
          </Button>
        </div>
      )}

      {messages.map((msg, idx) => (
        <ChatMessageItem
          key={msg.id ?? idx}
          msg={msg}
          currentUserId={user.id}
        />
      ))}

      <div ref={bottomRef} />

      {isFetching && (
        <div className="flex justify-center py-3">
          <Spinner />
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
  );
}
