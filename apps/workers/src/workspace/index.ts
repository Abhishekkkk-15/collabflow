import { prisma } from "@collabflow/db";
import { Queue, Worker } from "bullmq";
import { inviteQueue } from "../invite";

new Worker(
  "workspaceQueue",
  async (job) => {
    const { workspace, members } = job.data;
    const jobs = members.map((m) => ({
      name: "invite:send",
      data: { workspace, members: m },
    }));

    console.log(jobs);

    await inviteQueue.addBulk(jobs);
    console.log(`Fan-out: ${jobs.length} invites created}`);
  },
  {
    connection: { host: "localhost", port: 6379 },
  }
);
console.log("workspace.worker running");
