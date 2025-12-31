import { Worker, Job } from "bullmq";
import { prisma } from "@collabflow/db";
import { User } from "@prisma/client";
import { connection } from "../index";

const MESSAGE_BATCH_SIZE = 5;

type BufferedMessage = {
  clientMessageId: string;
  roomId: string;
  content: string;
  userId: string;
};

let BUFFER: BufferedMessage[] = [];

const dedupKey = (m: BufferedMessage) => `${m.clientMessageId}:${m.userId}`;

async function flushMessages(force = false) {
  if (!force && BUFFER.length < MESSAGE_BATCH_SIZE) return;
  if (BUFFER.length === 0) return;

  const unique = Array.from(
    new Map(BUFFER.map((m) => [dedupKey(m), m])).values()
  );

  try {
    console.log("messages: flushing to DB", unique.length);

    await prisma.chatMessage.createMany({
      data: unique.map((m) => ({
        clientMessageId: m.clientMessageId,
        content: m.content,
        slug: m.roomId,
        senderId: m.userId,
      })),
      skipDuplicates: true,
    });

    BUFFER = [];
    console.log("messages: flush successful");
  } catch (err) {
    console.error("messages: flush failed", err);
  }
}

async function gracefulShutdown(signal: string) {
  console.log(`messages: ${signal} received, flushing buffer`);
  await flushMessages(true);
  process.exit(0);
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export function startChatWorker() {
  console.log("Chat worker running");

  new Worker(
    "chatQueue",
    async (job: Job) => {
      const {
        clientMessageId,
        roomId,
        content,
        user,
      }: {
        clientMessageId: string;
        roomId: string;
        content: string;
        user: User;
      } = job.data;

      const item: BufferedMessage = {
        clientMessageId,
        roomId,
        content,
        userId: user.id,
      };

      const key = dedupKey(item);
      const exists = BUFFER.some((m) => dedupKey(m) === key);

      if (!exists) {
        BUFFER.push(item);
        console.log("messages: buffered", BUFFER.length, key);
      } else {
        console.log("messages: duplicate skipped", key);
      }

      await flushMessages();
    },
    {
      connection,
      concurrency: 5,
    }
  );
}
