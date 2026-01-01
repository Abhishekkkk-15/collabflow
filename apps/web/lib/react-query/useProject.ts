import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import type { Task, User } from "@prisma/client";
import { TaskWithWSP } from "@/components/project/ProjectDetails";
import { fetchProject } from "../api/project/fetchProjectDetails";

export interface ProjectResponse {
  project: any;
  totalTasks: number;
  totalMembers: number;
  myTasks: TaskWithWSP[];
  members: Member[];
}

type Member = {
  user: User;
  role?: string;
};
export function useProject(projectSlug: string) {
  return useQuery<ProjectResponse>({
    queryKey: ["project", projectSlug],
    queryFn: async () => fetchProject(projectSlug),
  });
}
