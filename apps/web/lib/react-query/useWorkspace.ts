import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import { fetchWorkspaceDetails } from "../api/workspace/fetchWorkspaceDetails";

export function useWorkspace(workspaceSlug: string) {
  return useQuery({
    queryKey: ["workspace", workspaceSlug],
    queryFn: () => fetchWorkspaceDetails(workspaceSlug),
  });
}
