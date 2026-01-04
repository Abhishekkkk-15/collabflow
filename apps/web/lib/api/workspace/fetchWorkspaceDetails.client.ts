export async function fetchWorkspaceDetailsClient(workspaceSlug: string) {
  const res = await fetch(`/api/workspace/${workspaceSlug}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch workspace details");
  }

  return res.json();
}
