import { cookies } from "next/headers";
import { auth } from "@/auth";
import SidebarShell from "@/components/self/SidebarShell";
import { TWorkspace } from "@/lib/redux/slices/workspace";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let fetchedWorkspaces: TWorkspace[] | null = null;

  try {
    await auth();

    const cookieStore = cookies();
    const BASE = "http://localhost:3000";

    const res = await fetch(`${BASE}/api/proxy/workspace`, {
      cache: "no-store",
      headers: {
        cookie: (await cookieStore).toString(),
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch workspaces");
    }

    fetchedWorkspaces = await res.json();
  } catch {
    fetchedWorkspaces = null;
  }

  return (
    <SidebarShell fetchedWorkspaces={fetchedWorkspaces}>
      {children}
    </SidebarShell>
  );
}
