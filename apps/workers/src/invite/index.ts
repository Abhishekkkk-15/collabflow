import { Queue, Worker } from "bullmq";
import { redisPub } from "../";
import { connection } from "../";
export const inviteQueue = new Queue("inviteQueue", {
  connection,
});
const emailQueue = new Queue("emailQueue", { connection });
redisPub.on("error", (err) => console.error("worker redis error", err));
redisPub.on("connect", () => console.log("worker redis connected"));

(async () => {
  await redisPub.connect();
})();
const worker = new Worker(
  "inviteQueue",
  async (job) => {
    const { workspace, members } = job.data;
    await emailQueue.add("email:invite", {
      to: members.email,
      subject: `You're invited to ${workspace.name}`,
      workspaceId: workspace.id,
    });

    await redisPub.publish(
      "socket-events",
      JSON.stringify({
        event: "notification",
        room: `user:${members.userId}`,
        payload: {
          id: workspace.id,
          name: workspace.name,
          description: workspace.description,
          workspace: workspace,
          type: "INVITE",
          typeMessage: "Workspace Invitation",
          createdAt: Date.now(),
        },
      })
    );
  },
  {
    connection,
  }
);
worker.on("failed", (e) => console.log("invite worker failed", e));
console.log("invite.worker running");
