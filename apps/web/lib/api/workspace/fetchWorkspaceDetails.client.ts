export async function fetchWorkspaceDetailsClient(workspaceSlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL!}/api/workspace/${workspaceSlug}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch workspace details");
  }

  return res.json();
}
