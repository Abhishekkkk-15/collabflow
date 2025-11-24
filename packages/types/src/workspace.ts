import { Notification } from "./notification";
import { Project } from "./project";
import { User } from "./user";
import { WorkspaceMember } from "./workspaceMember";
export interface Workspace {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  ownerId: string | null;
  owner?: User | null;
  members?: WorkspaceMember[];
  projects?: Project[];
  notifications?: Notification[];
}
