import { Worker } from "bullmq";
import { connection } from "../index";

const BATCH_MESSAGES: any[] = [];
connection;
export async function startChatWorker() {
  const worker = new Worker(
    "chatQueue",
    async (job) => {
      const { payload } = await job.data;
      console.log(payload);
    },
    {
      connection,
    }
  );
  console.log("Chat worker running");
}
