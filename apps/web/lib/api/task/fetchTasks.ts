export async function fetchTasks(workspaceSlug: string, projectSlug: string) {
  const res = await fetch(
    `/api/proxy/task?wsSlug=${workspaceSlug}&pSlug=${projectSlug}&page=1&limit=10`,
    {
      headers: {
        Cookie: (await cookieStore).toString(),
      },
      cache: "no-cache",
    }
  );
  const data = await res.json();
  return data;
}
