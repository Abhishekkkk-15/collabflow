"use client";
import { api } from "../api";

export async function fetchChats({
  slug,
  cursor,
  limit = 30,
}: {
  slug: string;
  cursor?: string;
  limit?: number;
}) {
  const res = await api.get("/api/proxy/chat", {
    params: { slug, cursor, limit },
  });
  return res.data;
}

export async function updateChat(id: string, content: string) {
  return api.patch(`/api/proxy/chat/${id}`, { content });
}

export async function deleteChat(id: string) {
  return api.delete(`/api/proxy/chat/${id}`);
}

export async function markAsRead(roomKey: string) {
  return api.patch(`/api/proxy/chat/read/${roomKey}`);
}
