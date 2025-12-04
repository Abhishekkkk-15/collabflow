import { Status, TaskPriority } from "./enum";
import { User } from "./user";
export type Task = {
  id: string;
  tag: string;
  title: string;
  status: Status;
  priority: TaskPriority;
  description: string;
  assignedTo: string[];
};
