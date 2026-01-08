import { Queue } from "bullmq";
import { connection } from "../";

type QueueName =
  | "inviteQueue"
  | "emailQueue"
  | "notificationQueue"
  | "workspaceQueue"
  | "projectQueue"
  | "chatQueue"
  | "taskQueue"
  | "projectInviteQueue";

export function createQueue(queue: QueueName) {
  return new Queue(queue, { connection: connection });
}

//    { name: 'workspaceQueue' },
//       { name: 'inviteQueue' },
//       { name: 'emailQueue' },
//       { name: 'notificationQueue' },
//       { name: 'projectQueue' },
//       { name: 'taskQueue' },
//       { name: 'chatQueue' },
