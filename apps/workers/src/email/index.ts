import { Worker, Queue } from "bullmq";
import { connection } from "../index";

export function startEmailWorker() {
  new Worker(
    "emailQueue",
    async (job) => {
      const { to, subject, workspaceId } = job.data;

      // Real email or mock
      console.log(`Email → ${to} | ${subject} | WS: ${workspaceId}`);
    },
    { connection }
  );

  console.log("email.worker running");
}
