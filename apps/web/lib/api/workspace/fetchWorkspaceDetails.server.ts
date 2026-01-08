import { cookies } from "next/headers";

export async function fetchWorkspaceDetailsServer(workspaceSlug: string) {
  const cookieStore = cookies();

  const res = await fetch(
    `${process.env.API_URL}/api/proxy/workspace/${workspaceSlug}`,
    {
      headers: {
        Cookie: (await cookieStore).toString(),
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch workspace details");
  }

  return res.json();
}
