"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  CheckCircle2,
  MessageCircle,
  AlertTriangle,
  UserPlus,
  AtSign,
  ClipboardList,
} from "lucide-react";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";

enum NotificationType {
  GENERAL = "GENERAL",
  INVITE = "INVITE",
  MENTION = "MENTION",
  TASK_ASSIGNED = "TASK_ASSIGNED",
  TASK_UPDATED = "TASK_UPDATED",
  PROJECT_UPDATED = "PROJECT_UPDATED",
  SYSTEM = "SYSTEM",
}

type RawNotif = {
  id: string;
  type: NotificationType;
  name: string;
  description?: string;
  avatarUrl?: string;
  workspace?: { id: string; name: string; slug?: string };
  createdAt?: string;
};

type Notif = RawNotif & { read?: boolean };

function timeAgo(iso?: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function IconForType({ type }: { type: NotificationType }) {
  switch (type) {
    case NotificationType.TASK_ASSIGNED:
    case NotificationType.TASK_UPDATED:
      return <ClipboardList className="h-4 w-4 text-primary" />;
    case NotificationType.INVITE:
      return <UserPlus className="h-4 w-4 text-emerald-600" />;
    case NotificationType.MENTION:
      return <AtSign className="h-4 w-4 text-violet-600" />;
    case NotificationType.SYSTEM:
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case NotificationType.GENERAL:
    default:
      return <MessageCircle className="h-4 w-4 text-muted-foreground" />;
  }
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notif[]>(() => {
    return [
      {
        id: "seed-1",
        type: NotificationType.TASK_ASSIGNED,
        name: "Task assigned: Fix header",
        description: "You were assigned 'Fix header' in Marketing board.",
        avatarUrl: undefined,
        workspace: { id: "ws1", name: "Acme Workspace", slug: "acme" },
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        read: false,
      },
      {
        id: "seed-2",
        type: NotificationType.MENTION,
        name: "You were mentioned",
        description: "Ravi mentioned you in the comments.",
        avatarUrl: undefined,
        workspace: { id: "ws1", name: "Acme Workspace", slug: "acme" },
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        read: false,
      },
    ];
  });

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  useEffect(() => {
    const io = getSocket();
    const handler = (raw: RawNotif) => {
      const newNotif: Notif = { ...raw, read: false };
      setNotifications((prev) => [newNotif, ...prev].slice(0, 50));
      console.log("notification", raw);
      toast(raw.name, {
        position: "top-center",
        description: raw.description,
        richColors: true,
      });
    };
    io.on("notification", handler);

    return () => {
      io.off("notification", handler);
    };
  }, []);

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function clearAll() {
    setNotifications([]);
  }

  // click handler for a notification (navigate if needed)
  function onNotifClick(n: Notif) {
    markAsRead(n.id);
    // Example: navigate to workspace or open related item
    // router.push(`/dashboard/${n.workspace?.slug}`);
    // For now show toast
    toast(n.name, {
      position: "top-center",
      description: n.description,
      richColors: true,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="relative p-2 rounded-lg hover:bg-accent transition"
          aria-label="Notifications">
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 text-[10px] px-1 py-0.5 rounded-full bg-red-600 text-white animate-pulse"
              aria-hidden>
              {unreadCount}
            </Badge>
          )}

          <Bell className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-96 rounded-xl shadow-lg p-2 bg-popover border">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="m-0 text-sm font-semibold">
            Notifications
          </DropdownMenuLabel>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-xs px-2 py-1 rounded hover:bg-muted text-muted-foreground">
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="text-xs px-2 py-1 rounded hover:bg-muted text-muted-foreground">
              Clear
            </button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <ScrollArea className="max-h-[360px]">
          <div className="space-y-1 px-2 py-1">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-2 rounded-md cursor-pointer hover:bg-muted transition ${
                    !n.read ? "bg-muted/10" : ""
                  }`}
                  onClick={() => onNotifClick(n)}>
                  <Avatar className="h-9 w-9">
                    {n.avatarUrl ? (
                      <AvatarImage src={n.avatarUrl} />
                    ) : (
                      <AvatarFallback>
                        <IconFallback type={n.type} />
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium truncate">
                        {n.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {timeAgo(n.createdAt)}
                      </div>
                    </div>

                    {n.description && (
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        {n.description}
                      </div>
                    )}

                    {n.workspace && (
                      <div className="text-xs text-[11px] text-muted-foreground mt-1">
                        <span className="font-medium">{n.workspace.name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      {!n.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(n.id);
                          }}
                          className="text-xs px-2 py-1 rounded bg-primary/5 hover:bg-primary/10 text-primary">
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // remove the single notification
                          setNotifications((prev) =>
                            prev.filter((it) => it.id !== n.id)
                          );
                        }}
                        className="text-xs px-2 py-1 rounded hover:bg-muted text-muted-foreground">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <DropdownMenuSeparator />
        <div className="px-3 py-2 text-xs text-muted-foreground">
          Notifications are kept for <strong>30 days</strong>.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Small helper to render tiny icons inside AvatarFallback */
function IconFallback({ type }: { type: NotificationType }) {
  switch (type) {
    case NotificationType.TASK_ASSIGNED:
    case NotificationType.TASK_UPDATED:
      return <ClipboardList className="h-4 w-4" />;
    case NotificationType.INVITE:
      return <UserPlus className="h-4 w-4" />;
    case NotificationType.MENTION:
      return <AtSign className="h-4 w-4" />;
    case NotificationType.SYSTEM:
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <MessageCircle className="h-4 w-4" />;
  }
}
