import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/api";

export function useWorkspace(workspaceSlug: string) {
  return useQuery({
    queryKey: ["workspace", workspaceSlug],
    queryFn: async () => {
      const res = await api.get(`/workspace/${workspaceSlug}`);
      return res.data;
    },
  });
}
