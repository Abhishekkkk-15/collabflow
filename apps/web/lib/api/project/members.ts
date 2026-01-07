import { api } from "../api";

export async function fetchProjectMembers(
  slug: string,
  limit = 5,
  page = 1,
  query = ""
) {
  const res = await api.get(
    `/api/proxy/project/${slug}/members?limit=${limit}&page=${page}&q=${query}`
  );
  return res.data.members;
}
