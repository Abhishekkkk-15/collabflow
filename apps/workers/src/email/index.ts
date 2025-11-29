import { Worker, Queue } from "bullmq";

new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, workspaceId } = job.data;

    // Real email or mock
    console.log(`Email → ${to} | ${subject} | WS: ${workspaceId}`);
  },
  { connection: { host: "localhost", port: 6379 } }
);

console.log("email.worker running");
