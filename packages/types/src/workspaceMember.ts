import { WorkspaceRole } from "./enum";
import { User } from "./user";
import { Workspace } from "./workspace";
export interface WorkspaceMember {
  id?: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  joinedAt?: Date;
  meta?: any;
  user?: User;
  workspace?: Workspace;
}
