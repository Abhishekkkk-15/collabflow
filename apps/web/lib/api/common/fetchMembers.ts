import { api } from "../api";
import { FuncOutput } from "./useMembers";
export type MembersPath = "WORKSPACE" | "PROJECT";

type MembersQueryInput = {
  path: MembersPath;
  slug: string;

  q?: string;

  cursor?: string | null;
  limit?: number;

  page?: number;
};

export async function fetchMembers({
  path,
  slug,
  q = "",
  cursor,
  limit = 10,
  page = 1,
}: MembersQueryInput): Promise<FuncOutput> {
  if (path === "WORKSPACE") {
    const res = await api.get(`/api/proxy/workspace/${slug}/members`, {
      params: {
        limit,
        cursor: cursor ?? "",
        q,
      },
    });

    return res.data;
  }

  const res = await api.get(`/project/${slug}/members`, {
    params: {
      limit,
      page,
      q,
    },
  });

  return {
    members: res.data.members,
    nextCursor: null,
    total: res.data.total ?? res.data.count,
    count: res.data.total,
  };
}
