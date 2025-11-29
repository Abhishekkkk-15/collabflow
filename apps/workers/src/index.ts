import {} from "bullmq";
import { createClient } from "redis";
export const connection = { host: "localhost", port: 6379 };
export const redisPub = createClient({ url: "redis://localhost:6379" });
