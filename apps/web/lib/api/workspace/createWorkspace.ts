import { Priority, ProjectStatus, WorkspaceRole } from "@prisma/client";
import { api } from "../api";

type WorkspaceMembers = {
  userId: string;
  role: WorkspaceRole;
  email: string;
};

type Payload = {
  name: string;
  slug: string;
  description?: string | undefined;
  members?: WorkspaceMembers[];
  priority: Priority | undefined;
  status: ProjectStatus;
};

export async function createWorkspace(payload: Payload) {
  return await api.post("/api/proxy/workspace", payload, {
    withCredentials: true,
  });
}
