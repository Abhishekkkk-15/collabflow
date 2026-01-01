import { useEffect, useRef } from "react";
import ChatMessageItem from "./ChatMessageItem";
import { Button } from "@/components/ui/button";

export default function ChatMessageList({
  messages,
  user,
  onLoadMore,
  isFetching,
  hasNextPage,
}: {
  messages: any[];
  user: any;
  onLoadMore: () => void;
  isFetching: boolean;
  hasNextPage: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 🔑 track WHY messages changed
  const loadingOlderRef = useRef(false);

  /* ---------------------------------------
     Auto-scroll ONLY for new realtime messages
  ---------------------------------------- */
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

  /* ---------------------------------------
     Reset flag after fetch completes
  ---------------------------------------- */
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
              loadingOlderRef.current = true; // 🔒 prevent auto-scroll
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
