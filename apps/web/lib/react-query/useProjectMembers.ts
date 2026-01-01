import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import { fetchProjectMembers } from "../api/project/members";

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

export function useProjectMembers(projectSlug: string, query = "") {
  return useQuery<ProjectMember[]>({
    queryKey: ["project-members", projectSlug, query],
    queryFn: async () => fetchProjectMembers(projectSlug, 2, 1, query),
    enabled: !!projectSlug,
  });
}
