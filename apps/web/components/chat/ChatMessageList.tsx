import { useEffect, useRef } from "react";
import ChatMessageItem from "./ChatMessageItem";

export default function ChatMessageList({
  messages,
  user,
}: {
  messages: any;
  user: any;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg: any, idx: number) => (
        <ChatMessageItem key={idx} msg={msg} currentUserId={user.id} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
