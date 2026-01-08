import { Worker } from "bullmq";
import { connection } from "../index";
import { createQueue } from "../config/queueFunc";

export function startProjecteWorker() {
  new Worker(
    "projectQueue",
    async (job) => {
      const { project, members, invitedBy } = job.data;
      const jobs = members.map((m) => ({
        name: "project.invite:send",
        data: { project, members: m, invitedBy },
      }));

      console.log(jobs);
      const projectInviteQueue = createQueue("projectInviteQueue");
      await projectInviteQueue.addBulk(jobs);
      console.log(`Fan-out: ${jobs.length} invites created}`);
    },
    {
      connection,
    }
  );
  console.log("project.worker running");
}
