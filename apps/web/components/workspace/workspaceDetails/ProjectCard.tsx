"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import { ProjectSettingsDialog } from "../ProjectSettingsDialog";

interface ProjectCardProps {
  project: any;
  workspaceSlug: string;
  isRestricted: boolean;
}

export default function ProjectCard({
  project,
  workspaceSlug,
  isRestricted,
}: ProjectCardProps) {
  return (
    <article className="bg-card border rounded-xl p-3 hover:shadow-sm transition flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1">
          <Link
            href={`/dashboard/${workspaceSlug}/${project.slug}/tasks`}
            className="block font-medium truncate hover:underline">
            {project.name}
          </Link>
          <p className="text-xs text-muted-foreground">
            Tasks{" "}
            <span className="font-medium">
              {project.taskCount !== undefined ? project.taskCount : "—"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {project.unreadCount > 0 && (
            <Badge className="text-[11px] px-2 py-0.5">
              {project.unreadCount}
            </Badge>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                aria-label="Project actions"
                size="icon"
                variant="ghost"
                className="h-8 w-8 z-50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-1">
              <div className="flex flex-col gap-0.5 text-sm">
                <Link
                  href={`/workspace/${workspaceSlug}/${project.slug}/tasks`}
                  className="px-3 py-1.5 rounded-md hover:bg-muted">
                  Open tasks
                </Link>
                <Link
                  href={`/workspace/${workspaceSlug}/${project.slug}/chat`}
                  className="px-3 py-1.5 rounded-md hover:bg-muted">
                  Open chat
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </article>
  );
}
