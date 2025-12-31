"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Flag, Tag, Layers } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Task, TaskPriority, TaskStatus, TaskTag } from "@prisma/client";

interface TaskDetailPageProps {
  task: Task & {
    creator: { id: string; name: string | null; image: string | null };
    assignees: {
      user: { id: string; name: string | null; image: string | null };
    }[];
    project?: { id: string; name: string } | null;
    workspace: { id: string; name: string };
  };
}

const statusColor: Record<TaskStatus, string> = {
  TODO: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-blue-500/10 text-blue-600",
  DONE: "bg-green-500/10 text-green-600",
  BLOCKED: "bg-red-500/10 text-red-600",
  REVIEW: "bg-purple-500/10 text-purple-600",
};

const priorityColor: Record<TaskPriority, string> = {
  LOW: "text-muted-foreground",
  MEDIUM: "text-yellow-600",
  HIGH: "text-red-600",
  URGENT: "text-red-700",
};

export default function TaskDetailPage({ task }: TaskDetailPageProps) {
  const assignees = useMemo(() => task.assignees ?? [], [task.assignees]);

  return (
    <div className=" max-w-7xl px-4 py-8">
      {/* HEADER (GitHub-style) */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={statusColor[task.status]}>
            {task.status.replace("_", " ")}
          </Badge>

          {task.project && (
            <Badge variant="secondary" className="gap-1">
              <Layers className="h-3.5 w-3.5" />
              {task.project.name}
            </Badge>
          )}
        </div>

        <h1 className="text-2xl font-semibold leading-tight">{task.title}</h1>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            <Flag className={`h-3.5 w-3.5 ${priorityColor[task.priority]}`} />
            {task.priority}
          </Badge>

          {task.tags.map((tag: TaskTag) => (
            <Badge key={tag} variant="outline" className="gap-1">
              <Tag className="h-3.5 w-3.5" />
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      <Separator className="my-6" />

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT — CONTENT (Conversation-style) */}
        <main className="lg:col-span-3 space-y-6">
          {/* Author block */}
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={task.creator.image ?? ""} />

              <AvatarFallback>{task.creator.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="text-sm">
                <span className="font-medium">
                  {task.creator.name ?? "Unknown"}
                </span>{" "}
                <span className="text-muted-foreground">
                  opened this task · {format(new Date(task.createdAt), "PPP")}
                </span>
              </div>

              <div className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
                {task.description || (
                  <span className="text-muted-foreground">
                    No description provided.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Activity placeholder */}
          <div className="border rounded-md p-4 text-sm text-muted-foreground">
            Activity timeline will appear here.
          </div>
        </main>

        {/* RIGHT — SIDEBAR (Metadata panel) */}
        <aside className="space-y-6 text-sm">
          {/* Assignees */}
          <section className="space-y-2">
            <h4 className="font-medium text-muted-foreground">Assignees</h4>

            {assignees.length === 0 ? (
              <span className="text-muted-foreground">No one assigned</span>
            ) : (
              <div className="flex -space-x-2">
                {assignees.map(({ user }) => (
                  <Avatar key={user.id} className="h-7 w-7">
                    <AvatarImage src={user.image ?? ""} />
                    <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}
          </section>

          <Separator />

          {/* Due date */}
          <section className="space-y-1">
            <h4 className="font-medium text-muted-foreground">Due date</h4>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {task.dueDate
                  ? format(new Date(task.dueDate), "PPP")
                  : "Not set"}
              </span>
            </div>
          </section>

          <Separator />

          {/* Created */}
          <section className="space-y-1">
            <h4 className="font-medium text-muted-foreground">Created</h4>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(task.createdAt), "PPP p")}</span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
