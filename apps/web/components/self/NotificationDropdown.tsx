"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  MessageCircle,
  AlertTriangle,
  UserPlus,
  AtSign,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import type { Notification } from "@prisma/client";
import { api } from "@/lib/api/api";
import { useSocket } from "../providers/SocketProvider";

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
  event: string;
  payload: Notification;
};

type Notif = Notification;

function timeAgo(iso?: string | Date) {
  if (!iso) return "";
  const ts = typeof iso === "string" ? new Date(iso).getTime() : iso.getTime();
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

/** tiny icon used inside avatar fallback */
function IconFallback({ type }: { type?: NotificationType }) {
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

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notif[]>([]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  async function fetchNotification() {
    const notification: Notification[] = (await api.get("/notification")).data;
    return notification;
  }

  const io = useSocket();
  useEffect(() => {
    if (!io) return;

    const handler = (raw: RawNotif) => {
      console.log("notificaion", raw.payload);
      const dbNotif = raw?.payload;
      if (!dbNotif) return;

      const newNotif: Notif = {
        ...dbNotif,
        isRead: Boolean(dbNotif.isRead),
      };

      setNotifications((prev) => [newNotif, ...prev].slice(0, 50));

      // show toast
      toast(dbNotif.title ?? "Notification", {
        description: dbNotif.body ?? undefined,
        position: "top-center",
        richColors: true,
      });
    };

    io.on("notification", handler);

    return () => {
      io.off("notification", handler);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const notificaion = await fetchNotification();
      setNotifications(notificaion);
    })();
  }, []);

  async function markAsRead(id: string) {
    // optimistic update locally
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    // TODO: call API to persist: POST /notifications/:id/mark-read
    // await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await api.patch("/notification");
    } catch (error) {
      console.log("error");
    }
  }

  function clearAll() {
    setNotifications([]);
    // optionally call API to clear; usually not required
  }

  // click handler for a notification (navigate if needed)
  function onNotifClick(n: Notif) {
    markAsRead(n.id);
    // if notification has link, navigate (hook your router here)
    if (n.link) {
      // example using next/navigation (uncomment if available)
      // import { useRouter } from "next/navigation"; const router = useRouter();
      // router.push(n.link);
      window.location.href = n.link;
      return;
    }

    // fallback toast
    toast(n.title ?? "Notification", {
      description: n.body ?? undefined,
      position: "top-center",
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
        className="w-96 rounded-xl shadow-lg p-2 bg-popover border ">
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

        <ScrollArea
          className="max-h-[360px] overflow-auto hide-scrollbar"
          style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="space-y-1 px-2 py-1">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((n) => {
                // try to pull actor avatar from meta if available
                const actorImage =
                  n.meta && typeof n.meta === "object"
                    ? (n.meta as any).actor?.image
                    : undefined;
                const workspaceName =
                  n.meta && typeof n.meta === "object"
                    ? (n.meta as any).workspaceName ?? undefined
                    : undefined;

                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 p-2 rounded-md cursor-pointer hover:bg-muted transition ${
                      !n.isRead ? "bg-muted/10" : ""
                    }`}
                    onClick={() => onNotifClick(n)}>
                    <Avatar className="h-9 w-9">
                      {actorImage ? (
                        <AvatarImage src={actorImage} />
                      ) : (
                        <AvatarFallback>
                          <IconFallback
                            type={n.type as unknown as NotificationType}
                          />
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium truncate">
                          {n.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {timeAgo(n.createdAt)}
                        </div>
                      </div>

                      {n.body && (
                        <div className="text-xs text-muted-foreground mt-1 truncate">
                          {n.body}
                        </div>
                      )}

                      {workspaceName && (
                        <div className="text-xs text-[11px] text-muted-foreground mt-1">
                          <span className="font-medium">{workspaceName}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        {!n.isRead && (
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
                );
              })
            )}
          </div>
        </ScrollArea>

        <DropdownMenuSeparator />
        <div className="px-3 py-2 text-xs text-muted-foreground z-22">
          Notifications are kept for <strong>30 days</strong>.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
