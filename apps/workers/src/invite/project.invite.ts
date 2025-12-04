// apps/workers/src/project-invite/index.ts
import { Queue, Worker } from "bullmq";
import { redisPub } from "../"; // your existing redis publisher client
import { connection } from "../"; // bullmq connection config
import { prisma } from "@collabflow/db";
import { NotificationType, ProjectRole } from "@collabflow/types";
import type { User } from "@prisma/client";
import { transformSocketToNotification } from "../lib/notifPayload";

export const projectInviteQueue = new Queue("projectInviteQueue", {
  connection,
});
const emailQueue = new Queue("emailQueue", { connection }); // reuse existing email queue

type ProjectMemberPayload = {
  projectId: string;
  userId: string;
  role: ProjectRole;
};

let BULK_PROJECT_MEMBER_STORE: ProjectMemberPayload[] = [];
const PROJECT_BATCH_SIZE = 2;

/**
 * Push into in-memory buffer and flush when threshold reached.
 * Deduplicates by projectId:userId before DB write.
 */
async function pushAndMaybeFlushProject(item: ProjectMemberPayload) {
  const key = `${item.projectId}:${item.userId}`;
  const exists = BULK_PROJECT_MEMBER_STORE.some(
    (m) => `${m.projectId}:${m.userId}` === key
  );

  if (!exists) {
    BULK_PROJECT_MEMBER_STORE.push(item);
    console.log(
      "project: pushed to buffer",
      BULK_PROJECT_MEMBER_STORE.length,
      `(${key})`
    );
  } else {
    console.log("project: skipped duplicate in buffer", key);
  }

  if (BULK_PROJECT_MEMBER_STORE.length >= PROJECT_BATCH_SIZE) {
    // create unique array by key
    const unique = Array.from(
      new Map(
        BULK_PROJECT_MEMBER_STORE.map((m) => [`${m.projectId}:${m.userId}`, m])
      ).values()
    );

    try {
      console.log("project: flushing batch to DB, count:", unique.length);
      await prisma.projectMember.createMany({
        data: unique.map((m) => ({
          projectId: m.projectId,
          userId: m.userId,
          role: m.role,
          // joinedAt will default to now() in schema
        })),
        skipDuplicates: true,
      });
      BULK_PROJECT_MEMBER_STORE = [];
      console.log("project: batch flush successful");
    } catch (err) {
      console.error("project: batch write failed", err);
      throw err;
    }
  }
}

/** Flush remaining buffered project members (used on shutdown) */
async function flushRemainingProject() {
  if (BULK_PROJECT_MEMBER_STORE.length === 0) return;

  const unique = Array.from(
    new Map(
      BULK_PROJECT_MEMBER_STORE.map((m) => [`${m.projectId}:${m.userId}`, m])
    ).values()
  );

  try {
    console.log("project: flushing remaining to DB:", unique.length);
    await prisma.projectMember.createMany({
      data: unique.map((m) => ({
        projectId: m.projectId,
        userId: m.userId,
        role: m.role,
      })),
      skipDuplicates: true,
    });
    BULK_PROJECT_MEMBER_STORE = [];
    console.log("project: flush remaining successful");
  } catch (err) {
    console.error("project: failed to flush remaining members", err);
  }
}

process.on("SIGINT", async () => {
  console.log("project: SIGINT received - flushing remaining members");
  await flushRemainingProject();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  console.log("project: SIGTERM received - flushing remaining members");
  await flushRemainingProject();
  process.exit(0);
});

/**
 * Start the Project Invite worker.
 *
 * Job shape expected:
 * {
 *   project: { id, name, slug, workspaceId, ... },
 *   member: { userId, role, email? },
 *   invitedBy: User (optional)
 * }
 */
export function startProjectInviteWorker() {
  const worker = new Worker(
    "projectInviteQueue",
    async (job) => {
      const { project, members, invitedBy } = job.data as {
        project: any; // minimal project info: id, name, slug, workspaceId
        members: { userId: string; role: ProjectRole; email?: string };
        invitedBy?: User | null;
      };
      console.log(project, members, invitedBy.image);

      // 1) Enqueue email for this member (if email present)
      if (members?.email) {
        await emailQueue.add(
          "email:project-invite",
          {
            to: members.email,
            subject: `You're invited to project ${project.name}`,
            projectId: project.id,
            invitedUserId: members.userId,
            projectName: project.name,
            workspaceId: project.workspaceId,
          },
          { attempts: 3, backoff: { type: "exponential", delay: 2000 } }
        );
      }

      // 2) Buffer project member for batched DB insert
      const payload: ProjectMemberPayload = {
        projectId: project.id,
        userId: members.userId,
        role: members.role,
      };
      await pushAndMaybeFlushProject(payload);

      // 3) Create notification in DB (persisted)
      // Link to project details (adjust front-end route as needed)
      const notification = await prisma.notification.create({
        data: {
          userId: members.userId,
          actorId: invitedBy?.id ?? null,
          projectId: project.id,
          workspaceId: project.workspaceId ?? null,
          type: "INVITE",
          title: "Project Invitation",
          body: `${invitedBy?.name ?? "Someone"} invited you to join project ${
            project.name
          }`,
          link: `/workspaces/${project.workspaceId}/projects/${project.slug}`,
          meta: {
            projectName: project.name,
            projectId: project.id,
            workspaceId: project.workspaceId,
            invitedBy: invitedBy
              ? {
                  id: invitedBy.id,
                  name: invitedBy.name,
                  email: invitedBy.email,
                  image: invitedBy.image,
                }
              : null,
          },
        },
      });

      // 4) Publish to Redis for websocket gateway to emit
      await redisPub.publish(
        "socket-events",
        JSON.stringify({
          event: "notification",
          room: `user:${members.userId}`,
          payload: transformSocketToNotification({
            notification,
            event: "INVITE",
            user: invitedBy,
          }),
        })
      );
    },
    { connection, concurrency: 1 }
  );

  worker.on("failed", (job, err) => {
    console.error("project-invite worker failed", job?.id, err);
  });

  console.log("project-invite.worker running");
}
