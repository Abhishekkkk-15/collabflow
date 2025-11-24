import { Status, TaskPriority } from "./enum";
export type Task = {
  id: string;
  tag: string;
  title: string;
  status: Status;
  priority: TaskPriority;
};
