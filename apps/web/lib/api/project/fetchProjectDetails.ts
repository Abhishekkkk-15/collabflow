import { api } from "../api";

export async function fetchProject(slug: string) {
  const res = await api.get(`/project?slug=${slug}`, {
    headers: {
      Cookie: (await cookieStore).toString(),
    },
    withCredentials: true,
  });
  return res.data;
}
