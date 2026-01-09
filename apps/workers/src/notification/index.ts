import { prisma } from "@collabflow/db";
import { connection } from "../index";
import { Worker } from "bullmq";

async function startNotificationWorker() {
  const worker = new Worker(
    "notificationQueue",
    async (job) => {
      const { actor, link, body, title, workspace, project, type, to } =
        await job.data;
      await prisma.notification.create({
        data: {
          actorId: actor,
          link,
          body,
          title,
          workspaceId: workspace.id,
          projectId: project.id,
          userId: to,
          type,
        },
      });
    },
    {
      connection,
    }
  );
}
