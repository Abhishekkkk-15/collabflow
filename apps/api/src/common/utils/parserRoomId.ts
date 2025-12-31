type ChatRoomScope = 'project' | 'workspace';

export function parseRoomId(roomId: string): {
  scope: ChatRoomScope;
  slug: string;
} {
  const [scope, slug] = roomId.split(':');

  if (!scope || !slug) {
    throw new Error(`Invalid roomId format: ${roomId}`);
  }

  if (scope !== 'project' && scope !== 'workspace') {
    throw new Error(`Unknown room scope: ${scope}`);
  }

  return { scope, slug };
}
