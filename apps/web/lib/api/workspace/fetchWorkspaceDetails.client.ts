export async function fetchWorkspaceDetailsClient(workspaceSlug: string) {
  const res = await fetch(`/api/proxy/workspace/${workspaceSlug}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch workspace details");
  }

  return res.json();
}
