import { Account } from "./account";
import { UserRole } from "./enum";
import { Project } from "./project";
import { ProjectMember } from "./projectMember";
import { Session } from "./session";
import { Workspace } from "./workspace";
import { WorkspaceMember } from "./workspaceMember";
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified?: Date | null;
  image: string | null;
  role: UserRole;
  accounts?: Account[];
  sessions?: Session[];
  workspaceMemberships?: WorkspaceMember[];
  projectMemberships?: ProjectMember[];
  ownedWorkspaces?: Workspace[];
  ownedProjects?: Project[];
  notifications?: Notification[];
}
