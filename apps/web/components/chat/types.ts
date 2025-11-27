// components/chat/types.ts
export type ChatUser = {
  id: string;
  name: string;
  avatar?: string | null;
  role?: string;
};

export type ChatMessage = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  text: string;
  files?: { id: string; name: string; url?: string; type?: string }[];
  mentions?: { id: string; name: string }[];
  reactions?: { emoji: string; userIds: string[] }[];
  createdAt: string;
  editedAt?: string | null;
  readBy?: string[]; // userIds
  threadRootId?: string | null;
};
