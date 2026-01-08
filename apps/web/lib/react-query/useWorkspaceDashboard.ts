import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import type { Project, Workspace, WorkspacePermission } from "@prisma/client";

export type EWorkspace = Workspace & {
  projects: Project[];
  permissions: WorkspacePermission;
};

export function useWorkspaceDashboard() {
  return useQuery<EWorkspace[]>({
    queryKey: ["workspace-dashboard"],
    queryFn: async () => {
      const res = await api.get("/api/proxy/workspace/dashboard");
      return res.data;
    },
    staleTime: 60 * 1000, // 1 min
  });
}
