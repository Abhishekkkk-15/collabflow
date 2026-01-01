import { api } from "../api";

export async function fetchWorkspaceDetails(slug: string) {
  const res = await api.get(`/workspace/${slug}`);
  return res.data;
}
