import { PROJECT_ROLE_VALUES } from "@collabflow/types";
import { z } from "zod";

export const ProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  workspaceId: z.string().min(1, "Workspace is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  status: z
    .enum(["DRAFT", "isActive", "PAUSED", "COMPLETED", "ARCHIVED"])
    .default("isActive"),
  dueDate: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), "Invalid date")
    .optional(),
  members: z
    .array(
      z.object({
        userId: z.string().min(1),
        role: z.enum(PROJECT_ROLE_VALUES),
      })
    )
    .optional(),
});
