import { ProjectMember } from "./projectMember";
import { User } from "./user";
import { Workspace } from "./workspace";
export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  slug: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  ownerId: string | null;
  owner?: User | null;
  workspace?: Workspace;
  members?: ProjectMember[];
  notifications?: Notification[];
  meta?: any;
}
