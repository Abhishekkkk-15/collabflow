import { Queue, Worker } from "bullmq";
import { redisPub } from "..";
import { connection } from "..";
import { NotificationType, WorkspaceRole } from "@collabflow/types";
import { prisma } from "@collabflow/db";
import { User } from "@prisma/client";

export const inviteQueue = new Queue("inviteQueue", { connection });
const emailQueue = new Queue("emailQueue", { connection });

type TMember = {
  userId: string;
  role: WorkspaceRole;
  email: string;
};

type WorkspaceMemberPayload = {
  userId: string;
  role: WorkspaceRole;
  workspaceId: string;
};

let BULK_WORKSPACE_MEMBER_STORE: WorkspaceMemberPayload[] = [];
const BATCH_SIZE = 5;

async function pushAndMaybeFlush(memberPayload: WorkspaceMemberPayload) {
  const exists = BULK_WORKSPACE_MEMBER_STORE.some(
    (m) =>
      m.workspaceId === memberPayload.workspaceId &&
      m.userId === memberPayload.userId
  );
  if (!exists) {
    BULK_WORKSPACE_MEMBER_STORE.push(memberPayload);
    console.log("pushed to buffer", BULK_WORKSPACE_MEMBER_STORE.length);
  } else {
    console.log("skipped duplicate in buffer:", memberPayload.userId);
  }

  if (BULK_WORKSPACE_MEMBER_STORE.length >= BATCH_SIZE) {
    const unique = Array.from(
      new Map(
        BULK_WORKSPACE_MEMBER_STORE.map((m) => [
          `${m.workspaceId}:${m.userId}`,
          m,
        ])
      ).values()
    );

    try {
      await prisma.workspaceMember.createMany({
        data: unique,
        skipDuplicates: true,
      });
      BULK_WORKSPACE_MEMBER_STORE = [];
      console.log("Batch flush successful");
    } catch (err) {
      console.error("Batch write failed:", err);

      throw err;
    }
  }
}

async function flushRemaining() {
  if (BULK_WORKSPACE_MEMBER_STORE.length === 0) return;
  const unique = Array.from(
    new Map(
      BULK_WORKSPACE_MEMBER_STORE.map((m) => [
        `${m.workspaceId}:${m.userId}`,
        m,
      ])
    ).values()
  );
  try {
    console.log("Flushing remaining to DB:", unique.length);
    await prisma.workspaceMember.createMany({
      data: unique,
      skipDuplicates: true,
    });
    BULK_WORKSPACE_MEMBER_STORE = [];
  } catch (err) {
    console.error("Failed to flush remaining members", err);
  }
}

process.on("SIGINT", async () => {
  console.log("SIGINT received - flushing remaining members");
  await flushRemaining();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  console.log("SIGTERM received - flushing remaining members");
  await flushRemaining();
  process.exit(0);
});

export function startInviteWorker() {
  const worker = new Worker(
    "inviteQueue",
    async (job) => {
      const { workspace, members, invitedBy } = job.data as {
        workspace: any;
        members: { userId: string; role: WorkspaceRole; email?: string };
        invitedBy?: User;
      };

      if (members?.email) {
        await emailQueue.add(
          "email:invite",
          {
            to: members.email,
            subject: `You're invited to ${workspace.name}`,
            workspaceId: workspace.id,
            invitedUserId: members.userId,
          },
          { attempts: 3, backoff: { type: "exponential", delay: 2000 } }
        );
      }

      const payloadToBeStoredInDb: WorkspaceMemberPayload = {
        userId: members.userId,
        role: members.role as WorkspaceRole,
        workspaceId: workspace.id as string,
      };

      await pushAndMaybeFlush(payloadToBeStoredInDb);
      console.log("Invited by", invitedBy);
      const notification = await prisma.notification.create({
        data: {
          userId: members.userId,

          actorId: invitedBy.id || null,
          workspaceId: workspace.id,

          type: "INVITE",

          title: `Workspace Invitation`,
          body: `${workspace.name} invited you to join.`,
          link: `/workspaces/${workspace.slug}`,

          meta: {
            workspaceName: workspace.name,
            workspaceId: workspace.id,
            invitedBy: invitedBy,
          },
        },
      });

      await redisPub.publish(
        "socket-events",
        JSON.stringify({
          event: "notification",
          room: `user:${members.userId}`,
          payload: notification,
        })
      );
    },
    { connection, concurrency: 1 }
  );

  worker.on("failed", (job, err) => {
    console.error("invite worker failed", job?.id, err);
  });

  console.log("invite.worker running");
}
