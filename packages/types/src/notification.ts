import { NotificationType } from "./enum";
import { Project } from "./project";
import { User } from "./user";
import { Workspace } from "./workspace";
export interface Notification {
  id: string;
  userId: string;
  workspaceId: string | null;
  projectId: string | null;
  title: string;
  body: string | null;
  type: NotificationType;
  link: string | null;
  meta?: any;
  isRead: boolean;
  createdAt: Date;
  actedAt: Date | null;
  user?: User;
  workspace?: Workspace | null;
  project?: Project | null;
}
