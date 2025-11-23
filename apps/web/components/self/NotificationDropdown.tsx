"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Bell, CheckCircle2, MessageCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";

export default function NotificationDropdown() {
  const notifications = [
    {
      id: 1,
      title: "Task completed",
      description: "Aayush completed 'Login Page UI'",
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    },
    {
      id: 2,
      title: "New comment",
      description: "Rohan commented on 'Navbar Fix'",
      icon: <MessageCircle className="h-4 w-4 text-blue-500" />,
    },
    {
      id: 3,
      title: "Deadline approaching",
      description: "Refresh tokens due tomorrow",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    },
  ];

  const unreadCount = notifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <Button size="icon" variant="outline" className="relative p-2 rounded-lg hover:bg-accent transition">
          {/* BADGE */}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 text-[10px] px-1 py-0.5 rounded-full bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}

          {/* ICON */}
          <Bell className="h-5 w-5 " />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-80 rounded-xl shadow-md p-2"
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Notifications
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {notifications.map((note) => (
          <DropdownMenuItem
            key={note.id}
            className="flex items-start gap-3 py-3 px-2 cursor-pointer"
          >
            <div>{note.icon}</div>
            <div>
              <p className="text-sm font-medium">{note.title}</p>
              <p className="text-xs text-muted-foreground leading-tight">
                {note.description}
              </p>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-center text-sm cursor-pointer">
          Mark all as read
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
