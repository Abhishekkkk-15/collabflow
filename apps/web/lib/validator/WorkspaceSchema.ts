import { z } from "zod";
const WorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name is too short"),
  slug: z.string().min(2, "Slug is too short"),
  description: z.string().optional(),
  members: z
    .array(
      z.object({
        userId: z.string(),
        role: z.enum(["OWNER", "VIEWER", "MAINTAINER", "CONTRIBUTOR"]),
        email: z.email(),
      })
    )
    .optional(),
});
export default WorkspaceSchema;
