// components/chat/ChatMessage.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import type { ChatMessage as CM } from "./types";

export default function ChatMessage({
  message,
  meUserId,
  onReact,
  onEdit,
  onDelete,
  onOpenThread,
}: {
  message: CM;
  meUserId: string;
  onReact: (msgId: string, emoji: string) => void;
  onEdit: (msgId: string, newText: string) => void;
  onDelete: (msgId: string) => void;
  onOpenThread: (msg: CM) => void;
}) {
  const amI = message.userId === meUserId;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(message.text || "");

  const timeAgo = useMemo(
    () => formatDistanceToNow(new Date(message.createdAt), { addSuffix: true }),
    [message.createdAt]
  );

  function saveEdit() {
    if (value.trim() && value !== message.text) {
      onEdit(message.id, value.trim());
    }
    setEditing(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${amI ? "justify-end" : "justify-start"}`}>
      {!amI && (
        <Avatar className="h-8 w-8">
          {message.userAvatar ? (
            <AvatarImage src={message.userAvatar} />
          ) : (
            <AvatarFallback>{message.userName?.[0]}</AvatarFallback>
          )}
        </Avatar>
      )}

      <div className="max-w-[70%]">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold">{message.userName}</div>
          <div className="text-xs text-muted-foreground">{timeAgo}</div>
          {message.editedAt && (
            <div className="text-xs text-muted-foreground"> • edited</div>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button
              className="p-1 rounded hover:bg-muted/40"
              onClick={() => onOpenThread(message)}>
              <MoreHorizontal />
            </button>
          </div>
        </div>

        <div
          className={`mt-1 p-3 rounded-lg ${
            amI ? "bg-primary/10 text-primary-foreground" : "bg-muted/10"
          }`}>
          {!editing ? (
            <MessageText text={message.text} mentions={message.mentions} />
          ) : (
            <div>
              <textarea
                className="w-full p-2 rounded"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <button
                  className="px-2 py-1 bg-primary text-white rounded"
                  onClick={saveEdit}>
                  Save
                </button>
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* files */}
          {message.files?.length ? (
            <div className="mt-2 flex gap-2">
              {message.files.map((f) => (
                <div
                  key={f.id}
                  className="w-28 h-20 bg-muted rounded overflow-hidden">
                  {f.type?.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.url}
                      className="w-full h-full object-cover"
                      alt={f.name}
                    />
                  ) : (
                    <div className="p-2 text-xs">{f.name}</div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* reactions */}
        <div className="flex items-center gap-2 mt-2">
          {(message.reactions || []).map((r) => (
            <button
              key={r.emoji}
              onClick={() => onReact(message.id, r.emoji)}
              className="px-2 py-1 rounded bg-muted/30 text-sm">
              {r.emoji} {r.userIds.length}
            </button>
          ))}

          <button
            onClick={() => onReact(message.id, "👍")}
            className="px-2 py-1 rounded bg-muted/10 text-sm">
            React 👍
          </button>

          {/* edit/delete for owner */}
          {amI && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="ml-2 text-xs text-muted-foreground">
                Edit
              </button>
              <button
                onClick={() => onDelete(message.id)}
                className="ml-1 text-xs text-destructive">
                Delete
              </button>
            </>
          )}
        </div>

        {/* read receipts */}
        <div className="text-xs text-muted-foreground mt-1">
          {message.readBy?.length ? `Read by ${message.readBy.length}` : ""}
        </div>
      </div>

      {amI && (
        <Avatar className="h-8 w-8">
          {message.userAvatar ? (
            <AvatarImage src={message.userAvatar} />
          ) : (
            <AvatarFallback>{message.userName?.[0]}</AvatarFallback>
          )}
        </Avatar>
      )}
    </motion.div>
  );
}

// small helper to render mentions highlighted
function MessageText({
  text,
  mentions,
}: {
  text: string;
  mentions?: { id: string; name: string }[];
}) {
  if (!mentions || mentions.length === 0) return <div>{text}</div>;

  // naive highlight: replace @name occurrences
  let result: (string | React.JSX.Element)[] = [text];
  mentions.forEach((m) => {
    result = result.flatMap((part) => {
      if (typeof part !== "string") return [part];
      const parts = part.split(new RegExp(`(@${escapeRegExp(m.name)})`, "g"));
      return parts.map((p, i) =>
        p === `@${m.name}` ? (
          <span
            key={m.id + i}
            className="px-1 py-0.5 rounded bg-primary/20 text-primary-foreground">
            @{m.name}
          </span>
        ) : (
          p
        )
      );
    });
  });

  return <div>{result}</div>;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
