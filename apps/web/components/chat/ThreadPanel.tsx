// components/chat/ThreadPanel.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { ChatMessage } from "./types";
import ChatInput from "./ChatInput";

export default function ThreadPanel({
  rootMessage,
  onClose,
  onSendThread,
  user,
  members,
}: {
  rootMessage: ChatMessage;
  onClose: () => void;
  onSendThread: (payload: {
    text: string;
    mentions?: any[];
    files?: File[];
    rootId: string;
  }) => void;
  user: any;
  members: any[];
}) {
  const [threadMessages, setThreadMessages] = useState<ChatMessage[]>([]); // could be fed from server

  return (
    <motion.aside
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      exit={{ x: 300 }}
      className="w-[420px] border-l bg-card flex flex-col">
      <div className="p-4 border-b flex items-start gap-3">
        <div className="flex-1">
          <div className="text-sm font-semibold">Thread</div>
          <div className="text-xs text-muted-foreground mt-1">
            {rootMessage.userName}: {rootMessage.text}
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted">
          Close
        </button>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {threadMessages.map((t) => (
          <div key={t.id} className="text-sm">
            {t.userName}: {t.text}
          </div>
        ))}
      </div>

      <div className="p-3 border-t">
        <ChatInput
          user={user}
          members={members}
          onSend={(payload) => {
            onSendThread({ ...payload, rootId: rootMessage.id });
          }}
        />
      </div>
    </motion.aside>
  );
}
