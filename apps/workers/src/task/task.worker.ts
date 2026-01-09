import { Worker } from "bullmq";
import { connection, redisPub } from "../index";
import { transformSocketToNotification } from "../lib/notifPayload";
import { EmailJobData } from "../email";
import { Project, Task, TaskAssignee, User, Workspace } from "@prisma/client";
import { EmailType } from "../email/email.types";
import { createQueue } from "../config/queueFunc";

export async function startTaskWorker() {
  const emailQueue = createQueue("emailQueue");
  const notificationQueue = createQueue("notificationQueue");
  console.log("task worker started");
  new Worker(
    "taskQueue",
    async (job) => {
      const {
        workspaceId,
        projectId,
        assignedBy,
        assignedTo,
        task,
        workspace,
        project,
      }: {
        workspaceId: string;
        projectId: string;
        assignedBy: User;
        assignedTo: User[];
        task: Task;
        workspace: Workspace;
        project: Project;
      } = await job.data;

      const noto = [];

      for (const t of assignedTo) {
        console.log("id", t.id);

        const not = transformSocketToNotification(
          { ...task, event: "TASK_ASSIGNED" },
          {
            workspace,
            invitedBy: assignedBy,
            recipientUserId: t.id,
          }
        );

        await emailQueue.add("send:email", {
          to: t.email,
          type: EmailType.TASK_ASSIGNED,
          subject: "Task Assigned",
          payload: {
            assigneeName: t.name,
            taskTitle: task.title,
            projectName: project.name,
            assignedBy: assignedBy.name,
            taskUrl: `${process.env.NEXT_PUBLIC_API_URL}/workspace/${workspace.slug}/project/${project.slug}/tasks/${task.id}`,
          },
        } as EmailJobData);
        await notificationQueue.add("save:notification", {
          actor: assignedBy.id,
          link: `${process.env.NEXT_PUBLIC_API_URL}/workspace/${workspace.slug}/project/${project.slug}/tasks/${task.id}`,
          body: task.description,
          type: "TASK_ASSIGNED",
          workspace,
          project,
          to: t.id,
          title: `Task Assigned ${task.title} in Project ${assignedBy.name}`,
        });
        // actor, link, body, title, workspace, project, type, to
        console.log("nott", not);
        noto.push(not);
      }

      console.log("git here", noto);

      for (const n of noto) {
        console.log("userId", n.userId);

        await redisPub.publish(
          "socket-events",
          JSON.stringify({
            event: "notification",
            room: `user:${n.userId}`,
            payload: n,
          })
        );
      }

      //   await redisPub.publish("socket-events", {});
    },
    {
      connection,
    }
  );
}
