import { api } from "@/lib/api/api";
import { useQuery } from "@tanstack/react-query";
// types/chat.ts
export interface ChatMessage {
  id: string;
  clientMessageId?: string;
  content: string;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
}

export interface ChatPageResponse {
  messages: ChatMessage[];
  page: number;
  totalPages: number;
}

export function useChats(roomId: string, page: number) {
  return useQuery<ChatPageResponse>({
    queryKey: ["chats", roomId, page],
    queryFn: async () => {
      const res = await api.get(`/chat/${roomId}?page=${page}&limit=10`);
      return res.data as ChatPageResponse;
    },
    placeholderData: (prev) => prev,
  });
}
