import { cookies } from "next/headers";

import { api } from "@/lib/api/api";
import { TWorkspace } from "@/lib/redux/slices/workspace";
import { ModeToggle } from "@/components/ModeToggle";
import NotificationDropdown from "@/components/self/NotificationDropdown";
import SidebarShell from "@/components/self/SidebarShell";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let fetchedWorkspaces: TWorkspace[] | null;
  try {
    const cookieStore = cookies();
    const res = await api.get("/workspace", {
      headers: {
        Cookie: (await cookieStore).toString(),
      },
      withCredentials: true,
    });
    fetchedWorkspaces = res.data;
  } catch (error: any) {
    fetchedWorkspaces = null;
  }
  return (
    <SidebarShell fetchedWorkspaces={fetchedWorkspaces}>
      {children}
    </SidebarShell>
  );
}
