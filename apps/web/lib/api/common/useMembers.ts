import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import { fetchMembers, MembersPath } from "./fetchMembers";

export interface Member {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

export type FuncOutput = {
  members: Member[];
  nextCursor?: string | null;
  count?: number;
  total?: number;
};

export function useMembers({
  path,
  slug,
  query = "",
  limit = 10,
  page = 1,
  cursor,
}: {
  path: MembersPath;
  slug: string;
  query?: string;
  limit?: number;
  page?: number;
  cursor?: string | null;
}) {
  return useQuery<FuncOutput>({
    queryKey: [
      "members",
      path,
      slug,
      path === "WORKSPACE" ? cursor : page,
      query,
    ],
    queryFn: () =>
      fetchMembers({
        path,
        slug,
        q: query,
        limit,
        page,
        cursor,
      }),
    enabled: true,
    placeholderData: (prev) => prev,
  });
}
