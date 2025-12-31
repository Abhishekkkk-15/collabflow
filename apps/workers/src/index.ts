import {} from "bullmq";
import { createClient } from "redis";
import { startInviteWorker } from "./invite/workspace.invite";
import { startProjectInviteWorker } from "./invite/project.invite";
import { startEmailWorker } from "./email";
import { startWorkspaceWorker } from "./workspace";
import { startProjecteWorker } from "./project/index";
// import { startNotificationWorker } from "./notification";
export const connection = { host: "localhost", port: 6379 };
export const redisPub = createClient({ url: "redis://localhost:6379" });
import { startTaskWorker } from "./task/task.worker";
import { startChatWorker } from "./chat";

async function main() {
  try {
    await redisPub.connect();
    console.log("Starting all workers in single process…");

    startInviteWorker();
    startEmailWorker();
    startWorkspaceWorker();
    startProjectInviteWorker();
    startProjecteWorker();
    startTaskWorker();
    startChatWorker();
    //   startNotificationWorker();
  } catch (error) {
    console.log("error");
  }
  redisPub.on("error", (err) => console.error("worker redis error", err));
  redisPub.on("connect", () => console.log("worker redis connected"));

  console.log("All workers started!");
}

main();
