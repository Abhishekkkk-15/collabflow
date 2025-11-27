// mock-messages.ts

import type { ChatMessage, ChatUser } from "@/components/chat/types";
import { addHours, subMinutes, subHours } from "date-fns";

const mockUsers: ChatUser[] = [
  { id: "u1", name: "Abhishek", avatar: "/a.png" },
  { id: "u2", name: "Rohan", avatar: "/r.png" },
  { id: "u3", name: "Sara", avatar: "/s.png" },
  { id: "u4", name: "Amit", avatar: "/amit.png" },
];

// generate a single message
function generateMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];

  return {
    id: "msg_" + Math.random().toString(36).slice(2, 10),
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    text: "This is a mock test message!",
    mentions: [],
    reactions: [],
    files: [],
    createdAt: new Date().toISOString(),
    readBy: [],
    ...overrides,
  };
}

// generate multiple messages (older first)
export function generateMockHistory(
  count = 20,
  before?: string
): ChatMessage[] {
  const baseTime = subHours(new Date(), 5);

  return Array.from({ length: count }).map((_, i) => {
    const minuteOffset = 2 * i;
    return generateMessage({
      text: randomText(),
      createdAt: subMinutes(baseTime, minuteOffset).toISOString(),
      mentions: randomMention(),
      reactions: randomReactions(),
      files: randomAttachment(),
    });
  });
}

// random text bodies
function randomText() {
  const messages = [
    "Hey team, how is the progress?",
    "I think we should refactor the task service.",
    "Great job on the UI update!",
    "Let's deploy this to staging?",
    "Can someone review the PR?",
    "Meeting at 5:00 PM today.",
    "@Abhishek please check this issue.",
    "Uploading the new screenshots now.",
    "What do you think about the new layout?",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// random mentions (10% chance)
function randomMention() {
  if (Math.random() < 0.1) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    return [{ id: user.id, name: user.name }];
  }
  return [];
}

// random reactions (20% chance)
function randomReactions() {
  if (Math.random() < 0.2) {
    return [{ emoji: "👍", userIds: ["u1", "u2"] }];
  }
  return [];
}

// random attachments (10% chance)
function randomAttachment() {
  if (Math.random() < 0.1) {
    return [
      {
        id: "file_" + Math.random().toString(36).slice(2),
        name: "screenshot.png",
        url: "/placeholder.png",
        type: "image/png",
      },
    ];
  }
  return [];
}
