"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Flag, Tag } from "lucide-react";
import { Task, TaskTag, User } from "@prisma/client";

interface ExtendedTask extends Task {
  assignees: { user: User }[];
}

const TAG_COLORS: Record<TaskTag, string> = {
  BUG: "bg-red-100 text-red-700",
  FEATURE: "bg-purple-100 text-purple-700",
  IMPROVEMENT: "bg-blue-100 text-blue-700",
  REFACTOR: "bg-yellow-100 text-yellow-700",
  DESIGN: "bg-pink-100 text-pink-700",
  DOCUMENTATION: "bg-gray-100 text-gray-700",
  FRONTEND: "bg-green-100 text-green-700",
  BACKEND: "bg-indigo-100 text-indigo-700",
  DATABASE: "bg-orange-100 text-orange-700",
  SECURITY: "bg-rose-100 text-rose-700",
  PERFORMANCE: "bg-teal-100 text-teal-700",
};

export default function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: {
  task: ExtendedTask | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] h-[80vh] overflow-hidden p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl font-semibold">
              {task.title}
            </DialogTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{task.status}</Badge>
              <Badge variant="outline">{task.priority}</Badge>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Description */}
            <section>
              <h4 className="text-sm font-medium text-muted-foreground">
                Description
              </h4>
              <p className="mt-2 text-sm">
                {task.description || "No description provided."}
              </p>
            </section>

            <Separator />

            {/* Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} />
                  Due date:
                  <span className="font-medium">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Flag size={14} />
                  Priority:
                  <span className="font-medium">{task.priority}</span>
                </div>
              </div>

              {/* Assignees */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Assignees
                </h4>
                <div className="flex -space-x-2">
                  {task.assignees.map(({ user }) => (
                    <Avatar key={user.id} className="h-8 w-8 border">
                      <AvatarImage src={user.image ?? ""} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <section>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Tag size={14} /> Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {task.tags.length === 0 && (
                  <span className="text-sm text-muted-foreground">No tags</span>
                )}
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 rounded text-xs ${TAG_COLORS[tag]}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <Separator />

            {/* Timestamps */}
            <section className="text-xs text-muted-foreground">
              Created: {new Date(task.createdAt).toLocaleString()} <br />
              Updated: {new Date(task.updatedAt).toLocaleString()}
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
