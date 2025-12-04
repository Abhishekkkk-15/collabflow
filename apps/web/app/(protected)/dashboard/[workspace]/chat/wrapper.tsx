// import ChatLayout from "@/components/chat/ChatLayout";
"use client";
import Chat from "@/components/chat/Chat";
import { generateMockHistory } from "@/components/chat/mock-messages";
import React from "react";

function Wrapper({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const loadMore = async ({
    beforeMessageId,
  }: {
    beforeMessageId?: string;
  }) => {
    // Simulate delay
    await new Promise((r) => setTimeout(r, 500));

    // generate 20 older messages
    return generateMockHistory(20, beforeMessageId);
  };
  return (
    <Chat
      roomId="workspace:design" // required
      user={{ id: "u1", name: "Abhishek", avatar: "/a.png" }} // required
      members={[{ id: "u2", name: "adfa", avatar: "DFA", role: "ADMIN" }]} // list for mentions
      socketUrl="http://localhost:3001" // optional (default)
      loadMore={loadMore} // optional infinite-scroll loader
      pageSize={30} // optional
    />
  );
}

export default Wrapper;
