import { connection } from "../index";
import { Worker } from "bullmq";

async function startNotificationWorker() {
  const worker = new Worker("notificationQueue", async (job) => {}, {
    connection,
  });
}
