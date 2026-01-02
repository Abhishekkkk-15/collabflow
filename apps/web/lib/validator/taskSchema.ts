import { TaskPriority, TaskStatus, TaskTag } from "@prisma/client";

import z, { string } from "zod";
// TODO: "TODO";
//     IN_PROGRESS: "IN_PROGRESS";
//     REVIEW: "REVIEW";
//     DONE: "DONE";
//     BLOCKED: "BLOCKED";

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BLOCKED"]),
  priority: z.enum(["LOW", "HIGH", "MEDIUM", "URGENT"]),
  tags: z.array(
    z.enum([
      "BUG",
      "FEATURE",
      "IMPROVEMENT",
      "REFACTOR",
      "DESIGN",
      "DOCUMENTATION",
      "FRONTEND",
      "BACKEND",
      "DATABASE",
      "SECURITY",
    ])
  ),
  assignedTo: z.array(
    z.object({
      id: z.string(),
      image: z.string(),
      name: z.string(),
      email: z.email(),
    })
  ),
  dueDate: z.date(),
  projectId: z.string(),
});
