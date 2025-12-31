import { Queue, Worker } from "bullmq";
import { connection, redisPub } from "../index";
import { transformSocketToNotification } from "../lib/notifPayload";
import { EmailJobData } from "../email";
import { Project, Task, TaskAssignee, User, Workspace } from "@prisma/client";
import { EmailType } from "../email/email.types";
const emailQueue = new Queue("emailQueue", { connection });
export async function startTaskWorker() {
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
      assignedTo.forEach(async (t) => {
        let not = transformSocketToNotification(
          { ...task, event: "TASK_ASSIGNED" },
          {
            workspace: workspace,
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
            taskUrl: `http://localhost:3000/workspace/${workspace.slug}/project/${project.slug}/tasks`,
          },
        } as EmailJobData);
        noto.push(not);
      });

      noto.forEach(async (n) => {
        await redisPub.publish(
          "socket-events",
          JSON.stringify({
            event: "notification",
            room: `user:${n.userId}`,
            payload: n,
          })
        );
      });

      //   await redisPub.publish("socket-events", {});
    },
    {
      connection,
    }
  );
}
