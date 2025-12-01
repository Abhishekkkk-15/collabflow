import {} from "bullmq";
import { createClient } from "redis";
import { startInviteWorker } from "./invite";
import { startEmailWorker } from "./email";
import { startWorkspaceWorker } from "./workspace";
// import { startNotificationWorker } from "./notification";
export const connection = { host: "localhost", port: 6379 };
export const redisPub = createClient({ url: "redis://localhost:6379" });

async function main() {
  try {
    await redisPub.connect();
    console.log("Starting all workers in single process…");

    startInviteWorker();
    startEmailWorker();
    startWorkspaceWorker();
    //   startNotificationWorker();
  } catch (error) {
    console.log("error");
  }
  redisPub.on("error", (err) => console.error("worker redis error", err));
  redisPub.on("connect", () => console.log("worker redis connected"));

  console.log("All workers started!");
}

main();
