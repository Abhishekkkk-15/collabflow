import { Worker } from "bullmq";
import { connection, redisPub } from "../index";
import { transformSocketToNotification } from "../lib/notifPayload";
export async function startTaskWorker() {
  console.log("task worker started");
  new Worker(
    "taskQueue",
    async (job) => {
      const { workspaceId, projectId, assignedBy, assignedTo, task } =
        await job.data;
      console.log(workspaceId, projectId, assignedBy, assignedTo, task);

      const noto = [];
      assignedTo.forEach((t) => {
        let not = transformSocketToNotification(
          { ...task, event: "TASK_ASSIGNED" },
          {
            workspace: workspaceId,
            invitedBy: assignedBy,
            recipientUserId: t,
          }
        );
        console.log("p", not);
        noto.push(not);
      });

      console.log("payload", noto);
      noto.forEach(async (n) => {
        console.log("id", n.userId);
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
