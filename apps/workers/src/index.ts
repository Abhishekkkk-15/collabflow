import { startInviteWorker } from "./invite/workspace.invite";
import { startProjectInviteWorker } from "./invite/project.invite";
import { startEmailWorker } from "./email";
import { startWorkspaceWorker } from "./workspace";
import { startProjecteWorker } from "./project/index";
// import { startNotificationWorker } from "./notification";

import { startTaskWorker } from "./task/task.worker";
import { startChatWorker } from "./chat";
import { redis } from "./config/resdis";

export const connection = redis;
export const redisPub = redis;

async function main() {
  try {
    console.log("Starting all workers in single process…");

    startInviteWorker();
    startEmailWorker();
    startWorkspaceWorker();
    startProjectInviteWorker();
    startProjecteWorker();
    startTaskWorker();
    startChatWorker();
    // startNotificationWorker();
  } catch (error) {
    console.log("error");
  }
  console.log("All workers started!");
}

main();
