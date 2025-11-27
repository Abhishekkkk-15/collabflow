// components/chat/ChatInput.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Paperclip, Send } from "lucide-react";
import MentionList from "./MentionList";
import type { ChatUser } from "./types";

export default function ChatInput({
  user,
  members,
  onSend,
  onTyping,
}: {
  user: ChatUser;
  members: ChatUser[];
  onSend: (payload: {
    text: string;
    mentions: { id: string; name: string }[];
    files?: File[];
  }) => void;
  onTyping?: (isTyping: boolean) => void;
}) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentions, setMentions] = useState<{ id: string; name: string }[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const typingTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
    };
  }, []);

  function emitTyping() {
    if (onTyping) {
      onTyping(true);
      if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
      typingTimeout.current = window.setTimeout(() => onTyping(false), 2000);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setText(v);
    emitTyping();

    // detect last '@' occurrence and set query
    const lastAt = v.lastIndexOf("@");
    if (lastAt >= 0) {
      const q = v.slice(lastAt + 1);
      // only show if not whitespace and length < 50
      if (!/\s/.test(q)) {
        setMentionQuery(q);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e?.target?.files!)]);
      e.currentTarget.value = "";
    }
  }

  function handleMentionSelect(m: ChatUser) {
    // replace last @query with '@name'
    const lastAt = text.lastIndexOf("@");
    const before = text.slice(0, lastAt);
    const after = text.slice(lastAt).replace(/^@\S*/, ""); // remove the query
    const newText = `${before}@${m.name} ${after}`.trim() + " ";
    setText(newText);
    setMentions((prev) => {
      // avoid duplicates
      if (prev.find((p) => p.id === m.id)) return prev;
      return [...prev, { id: m.id, name: m.name }];
    });
    setShowMentions(false);
    inputRef.current?.focus();
  }

  function handleSend() {
    if (!text.trim() && files.length === 0) return;
    onSend({
      text: text.trim(),
      mentions,
      files: files.length ? files : undefined,
    });
    setText("");
    setFiles([]);
    setMentions([]);
    setShowMentions(false);
  }

  return (
    <div className="p-3 border-t bg-card">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          {user.avatar ? (
            <AvatarImage src={user.avatar} />
          ) : (
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            placeholder="Message someone… (use @ to mention)"
            value={text}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          {showMentions && mentionQuery !== "" && (
            <div className="absolute left-0 bottom-14 z-50 w-full">
              <MentionList
                members={members}
                query={mentionQuery}
                onSelect={handleMentionSelect}
              />
            </div>
          )}

          {files.length > 0 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-muted rounded-md flex-shrink-0 p-1">
                  {f.type.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={URL.createObjectURL(f)}
                      className="w-full h-full object-cover rounded"
                      alt={f.name}
                    />
                  ) : (
                    <div className="text-xs break-words">{f.name}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 items-center">
          <label className="cursor-pointer p-2 rounded hover:bg-accent/40">
            <Paperclip />
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <Button size="sm" onClick={handleSend} className="h-9">
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}
