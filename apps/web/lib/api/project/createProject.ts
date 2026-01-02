import { Priority, Project, ProjectRole, ProjectStatus } from "@prisma/client";
import { api } from "../api";

type ProjectMember = {
  userId: string;
  role: ProjectRole;
};

type Payload = {
  name: string;
  slug: string;
  description?: string;
  workspaceId: string;
  priority: Priority;
  status: ProjectStatus;
  dueDate?: string;
  members?: ProjectMember[];
};

export const handleCreateProject = async (payload: Payload) =>
  await api.post("/project", payload, {
    withCredentials: true,
  });
