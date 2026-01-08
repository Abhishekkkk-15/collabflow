import { Worker } from "bullmq";
// import { inviteQueue } from "../invite/workspace.invite";
import { connection } from "../index";
import { createQueue } from "../config/queueFunc";

export function startWorkspaceWorker() {
  console.log("workspace.worker running");
  const inviteQueue = createQueue("inviteQueue");
  new Worker(
    "workspaceQueue",
    async (job) => {
      const { workspace, members, invitedBy } = job.data;
      const jobs = members.map((m) => ({
        name: "invite:send",
        data: { workspace, members: m, invitedBy },
      }));

      console.log(jobs);

      await inviteQueue.addBulk(jobs);
      console.log(`Fan-out: ${jobs.length} invites created}`);
    },
    {
      connection,
      concurrency: 5,
    }
  );
}
