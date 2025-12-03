import { Queue, Worker } from "bullmq";
import { inviteQueue } from "../invite/workspace.invite";
import { connection } from "../index";

export function startWorkspaceWorker() {
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
    }
  );
  console.log("workspace.worker running");
}
