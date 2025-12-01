import { connection } from "../index";
import { prisma } from "@collabflow/db";
import { Queue, Worker } from "bullmq";

async function startNotificationWorker() {
  const worker = new Worker("notificationQueue", async (job) => {});
}
