import { NotificationType } from "@collabflow/types";
type RawPayload = {
  event?: NotificationType;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
  };
  mentionedUser?: string;
  roomId?: string;
  text?: string;
  body?: string;
  // any other fields from socket
  [k: string]: any;
};

type WorkspaceLite = {
  id: string;
  slug?: string;
  name?: string;
};

type Actor = {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
};

type NotificationOut = {
  userId: string | null; // recipient
  actorId: string | null; // who performed the action
  workspaceId: string | null;
  type: string;
  title: string;
  body: string;
  link?: string | null;
  meta?: Record<string, any>;
};

/**
 * Try to parse workspace slug/id from a roomId like "workspace:e-commerce_eae82..."
 */
function parseWorkspaceFromRoomId(roomId?: string): {
  slug?: string;
  id?: string;
} {
  if (!roomId) return {};
  // common pattern "workspace:slug" or "workspace:slug_uuid" etc.
  const parts = roomId.split(":");
  if (parts.length < 2) return {};
  const payload = parts.slice(1).join(":"); // e.g. "e-commerce_eae82cd89..."
  // try split at first underscore if present
  const [slugOrId] = payload.split(/[_]/);
  return { slug: slugOrId, id: payload };
}

/**
 * Transform raw socket payload into your notification object.
 *
 * @param raw incoming socket data
 * @param opts.workspace optional workspace object (preferred)
 * @param opts.invitedBy optional actor object (preferred when event=INVITE)
 * @param opts.recipientUserId optional explicit recipient id (overrides mentionedUser)
 */
export function transformSocketToNotification(
  raw: RawPayload,
  opts?: {
    workspace?: WorkspaceLite | null;
    invitedBy?: Actor | null;
    recipientUserId?: string | null;
  }
): NotificationOut {
  const event = (raw.event || raw?.typemessage || "").toString().toUpperCase();
  const actor = raw.user || opts?.invitedBy || null;
  const recipient =
    opts?.recipientUserId ?? raw.mentionedUser ?? raw.toUserId ?? null;

  // workspace inference
  let workspaceId: string | null = null;
  let workspaceSlug: string | undefined;
  let workspaceName: string | undefined;

  if (opts?.workspace) {
    workspaceId = opts.workspace.id;
    workspaceSlug = opts.workspace.slug;
    workspaceName = opts.workspace.name;
  } else {
    const parsed = parseWorkspaceFromRoomId(raw.roomId);
    workspaceId = parsed.id ?? null;
    workspaceSlug = parsed.slug;
    workspaceName = parsed.slug ?? null;
  }

  // helper to build link (adjust your route patterns)
  const workspaceLink = workspaceSlug ? `/workspaces/${workspaceSlug}` : null;
  const chatLink = workspaceSlug
    ? `/dashboard/${workspaceSlug}/chat`
    : workspaceLink;

  // default title/body per event
  let type = "GENERAL";
  let title =
    raw.body ?? raw.text ?? `${actor?.name ?? "Someone"} triggered an event`;
  let body = raw.body ?? raw.text ?? "";

  switch (event) {
    case "MENTION":
    case "MENTIOIN": // handle your typo variant
      type = "MENTION";
      title = `${actor?.name ?? "Someone"} mentioned you`;
      body =
        raw.text ??
        raw.body ??
        `${actor?.name ?? "Someone"} mentioned you in ${
          workspaceName ?? "a workspace"
        }`;
      break;

    case "INVITE":
      type = "INVITE";
      title = `Workspace Invitation`;
      body = `${workspaceName ?? "A workspace"} invited you to join.`;
      break;

    case "TASK_ASSIGNED":
      type = "TASK_ASSIGNED";
      title = raw.title ?? `Task assigned by ${actor?.name ?? "someone"}`;
      body = raw.text ?? raw.body ?? "";
      break;

    case "TASK_UPDATED":
      type = "TASK_UPDATED";
      title = raw.title ?? `Task updated`;
      body = raw.text ?? raw.body ?? "";
      break;

    case "PROJECT_UPDATED":
      type = "PROJECT_UPDATED";
      title = raw.title ?? `Project updated`;
      body = raw.text ?? raw.body ?? "";
      break;

    case "SYSTEM":
      type = "SYSTEM";
      title = raw.title ?? `System message`;
      body = raw.text ?? raw.body ?? "";
      break;

    default:
      type = event || "GENERAL";
      title =
        raw.title ??
        raw.body ??
        raw.text ??
        `${actor?.name ?? "Someone"} sent a notification`;
      body = raw.body ?? raw.text ?? "";
  }

  // Build meta with useful context
  const meta: Record<string, any> = {
    rawEvent: raw,
    workspaceName,
    workspaceSlug,
    workspaceId,
    actor,
    roomId: raw.roomId ?? null,
  };

  // Final normalized notification payload
  const out: NotificationOut = {
    userId: recipient ?? null,
    actorId: actor?.id ?? null,
    workspaceId: workspaceId ?? null,
    type,
    title,
    body,
    link: event === "MENTION" ? chatLink : workspaceLink,
    meta,
  };

  return out;
}
