import { TaskPriority, TaskStatus, TaskTag } from "@prisma/client";
import { api } from "../api";

type Payload = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: TaskTag[];
  assignedTo: any[];
  dueDate: Date | null;
  projectId: string;
};
export const handleAddTask = async (payload: Payload) =>
  await api.post("/task", {
    ...payload,
  });
