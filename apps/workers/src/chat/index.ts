import { Worker } from "bullmq";

const BATCH_MESSAGES: any[] = [];

export async function startChatWorker() {
  const worker = new Worker("messagesQueue", async (job) => {
    const { payload } = job.data;
    console.log(payload);
  });
}
