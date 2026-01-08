import { api } from "../api";

export async function fetchTasks(workspaceSlug: string, projectSlug: string) {
  const res = await api.get(
    `/api/proxy/task?wsSlug=${workspaceSlug}&pSlug=${projectSlug}&page=1&limit=10`,
    {
      headers: {
        Cookie: (await cookieStore).toString(),
      },
      withCredentials: true,
    }
  );
  return res.data;
}
