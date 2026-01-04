"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MentionDropdown from "./MentionDropdown";
import { Input } from "@/components/ui/input";
import { Socket } from "socket.io-client";
import { v4 as uuidV4 } from "uuid";
import { User } from "next-auth";
export default function ChatInput({
  user,
  members,
  roomId,
  socket,
  setQuery,
  isLoading,
}: {
  user: User;
  members: any[];
  roomId: string;
  socket: Socket;
  setQuery: (q: string) => void;
  isLoading: boolean;
}) {
  const [text, setText] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const updateQuery = (q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(q);
    }, 300);
  };

  const filteredMembers = useMemo(() => {
    const atIndex = text.lastIndexOf("@");
    if (atIndex === -1) return [];

    const q = text.slice(atIndex + 1).toLowerCase();
    if (!q) return members;

    return members.filter((m) => m.name.toLowerCase().includes(q));
  }, [text, members]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("typing", {
      payload: {
        roomId,
        userId: user.id,
        isTyping: text.length > 0,
      },
    });
  }, [text, socket, roomId, user.id]);

  const handleChange = (val: string) => {
    setText(val);

    const atIndex = val.lastIndexOf("@");
    if (atIndex !== -1) {
      const q = val.slice(atIndex + 1);
      updateQuery(q);
      setMentionOpen(true);
    } else {
      setMentionOpen(false);
      setQuery("");
    }
  };

  const send = () => {
    if (!text.trim() || !socket) return;

    socket.emit("send", {
      payload: {
        roomId,
        clientMessageId: uuidV4(),
        text,
        mentionedUser: selectedUser,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      },
    });

    setText("");
    setMentionOpen(false);
    setSelectedUser(null);
    setQuery("");
  };

  return (
    <div className="p-4 border-t relative">
      <Input
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Message @someone…"
        className="pr-20"
      />

      {mentionOpen && filteredMembers.length > 0 && !isLoading && (
        <MentionDropdown
          members={filteredMembers}
          onSelect={(m: any) => {
            const lastAt = text.lastIndexOf("@");
            const updated = text.slice(0, lastAt + 1) + m.name + " ";

            setSelectedUser(m.id);
            setText(updated);
            setMentionOpen(false);
          }}
        />
      )}

      <button
        onClick={send}
        className="absolute right-6 bottom-6 text-sm bg-primary text-primary-foreground px-3 py-1 rounded-lg">
        Send
      </button>
    </div>
  );
}
