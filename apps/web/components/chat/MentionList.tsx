// components/chat/MentionList.tsx
"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { ChatUser } from "./types";

export default function MentionList({
  members,
  query,
  onSelect,
}: {
  members: ChatUser[];
  query: string;
  onSelect: (u: ChatUser) => void;
}) {
  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-popover border rounded shadow-md max-h-56 overflow-auto">
      {filtered.length === 0 ? (
        <div className="p-2 text-sm text-muted-foreground">No users</div>
      ) : (
        filtered.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m)}
            className="w-full flex items-center gap-2 p-2 hover:bg-muted/50">
            <Avatar className="h-6 w-6">
              {m.avatar ? (
                <AvatarImage src={m.avatar} />
              ) : (
                <AvatarFallback>{m.name[0]}</AvatarFallback>
              )}
            </Avatar>
            <div className="text-sm">{m.name}</div>
            <div className="ml-auto text-xs text-muted-foreground">
              {m.role}
            </div>
          </button>
        ))
      )}
    </div>
  );
}
