import { cookies } from "next/headers";
import { auth } from "@/auth";
import SidebarShell from "@/components/self/SidebarShell";
import { TWorkspace } from "@/lib/redux/slices/workspace";
import { serverFetch } from "@/lib/api/server-fetch";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let fetchedWorkspaces: TWorkspace[] | null = null;

  try {
    await auth();

    const cookieStore = cookies();
    const BASE = process.env.NEXT_PUBLIC_API_URL!;

    // const res = await fetch(`${BASE}/api/proxy/workspace`, {
    //   cache: "no-store",
    //   headers: {
    //     cookie: (await cookieStore).toString(),
    //   },
    // });
    const res = await serverFetch("/workspace");
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
