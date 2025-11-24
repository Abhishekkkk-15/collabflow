import { ProjectRole } from "./enum";
import { Project } from "./project";
import { User } from "./user";
export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
  meta?: any;
  user?: User;
  project?: Project;
}
