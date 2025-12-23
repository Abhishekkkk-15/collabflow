type RawPayload = {
  event?: string;
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

function parseWorkspaceFromRoomId(roomId?: string): {
  slug?: string;
  id?: string;
} {
  if (!roomId) return {};
  const parts = roomId.split(':');
  if (parts.length < 2) return {};
  const payload = parts.slice(1).join(':');
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
  },
): NotificationOut {
  const event = (raw.event || raw?.typemessage || '').toString().toUpperCase();
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
    workspaceName = parsed.slug! ?? null;
  }

  const workspaceLink = workspaceSlug ? `/workspace/${workspaceSlug}` : null;
  const chatLink = workspaceSlug
    ? `/workspace/${workspaceSlug}/chat`
    : workspaceLink;

  let type = 'GENERAL';
  let title =
    raw.body ?? raw.text ?? `${actor?.name ?? 'Someone'} triggered an event`;
  let body = raw.body ?? raw.text ?? '';

  switch (event) {
    case 'MENTION':
    case 'MENTIOIN':
      type = 'MENTION';
      title = `${actor?.name ?? 'Someone'} mentioned you`;
      body =
        raw.text ??
        raw.body ??
        `${actor?.name ?? 'Someone'} mentioned you in ${workspaceName ?? 'a workspace'}`;
      break;

    case 'INVITE':
      type = 'INVITE';
      title = `Workspace Invitation`;
      body = `${workspaceName ?? 'A workspace'} invited you to join.`;
      break;

    case 'TASK_ASSIGNED':
      type = 'TASK_ASSIGNED';
      title = raw.title ?? `Task assigned by ${actor?.name ?? 'someone'}`;
      body = raw.text ?? raw.body ?? '';
      break;

    case 'TASK_UPDATED':
      type = 'TASK_UPDATED';
      title = raw.title ?? `Task updated`;
      body = raw.text ?? raw.body ?? '';
      break;

    case 'PROJECT_UPDATED':
      type = 'PROJECT_UPDATED';
      title = raw.title ?? `Project updated`;
      body = raw.text ?? raw.body ?? '';
      break;

    case 'SYSTEM':
      type = 'SYSTEM';
      title = raw.title ?? `System message`;
      body = raw.text ?? raw.body ?? '';
      break;

    default:
      type = event || 'GENERAL';
      title =
        raw.title ??
        raw.body ??
        raw.text ??
        `${actor?.name ?? 'Someone'} sent a notification`;
      body = raw.body ?? raw.text ?? '';
  }

  const meta: Record<string, any> = {
    rawEvent: raw,
    workspaceName,
    workspaceSlug,
    workspaceId,
    actor,
    roomId: raw.roomId ?? null,
  };

  const out: NotificationOut = {
    userId: recipient ?? null,
    actorId: actor?.id ?? null,
    workspaceId: workspaceId ?? null,
    type,
    title,
    body,
    link: event === 'MENTION' ? chatLink : workspaceLink,
    meta,
  };

  return out;
}
