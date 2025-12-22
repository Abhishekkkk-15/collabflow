"use client";

import React from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  FolderKanban,
  Users,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Activity,
  TrendingUp,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

type Member = {
  id: string;
  name: string;
  email?: string;
  image?: string;
  role?: string;
};

type Project = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status?: string;
  priority?: string;
  workspaceId?: string;
  workspaceSlug?: string;
  unreadCount?: number;
  taskCount?: number;
  members?: Member[];
  ownerId?: string;
  owner?: { id: string; name?: string; email?: string; image?: string };
  createdAt?: Date;
  updatedAt?: Date;
};

export default function ProjectDetails({
  project: projectProp,
  members: membersProp,
}: {
  project?: Project;
  members?: Member[];
}) {
  const project = projectProp ?? ({} as Project);
  const members = membersProp ?? project.members ?? [];

  const statusColor = {
    DRAFT: "secondary",
    isActive: "default",
    PAUSED: "secondary",
    COMPLETED: "default",
  } as Record<string, any>;

  const priorityColor = {
    LOW: "secondary",
    MEDIUM: "default",
    HIGH: "destructive",
  } as Record<string, any>;

  const visibleMembers = members.slice(0, 6);
  const remainingMembers = Math.max(0, members.length - visibleMembers.length);

  if (!project || !project.id) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <FolderKanban className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                No Project Selected
              </h3>
              <p className="text-sm text-muted-foreground">
                Please select a project to view its details
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <Card className="overflow-hidden border-2 shadow-sm">
        <div className="bg-gradient-to-br ">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Project Icon & Title */}
              <div className="flex gap-6 items-start flex-1">
                <div className="relative shrink-0 ">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 dark:from-blue-400 dark:via-blue-300 dark:to-blue-200 flex items-center justify-center shadow-xl ring-4 ring-background">
                    <span className="text-3xl font-bold text-white dark:text-blue-900">
                      {(project.name || "P").charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                      {project.name}
                    </h1>
                    {project.priority && (
                      <Badge
                        variant={priorityColor[project.priority] || "default"}
                        className="text-xs font-semibold">
                        {project.priority}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="font-mono text-xs">
                      /{project.slug}
                    </Badge>
                    {project.status && (
                      <Badge
                        variant={statusColor[project.status] || "secondary"}
                        className="text-xs">
                        {project.status === "isActive"
                          ? "Active"
                          : project.status}
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground leading-relaxed max-w-3xl">
                    {project.description ||
                      "No description available for this project."}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {project.taskCount ?? 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Tasks</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{members.length}</div>
                  <div className="text-xs text-muted-foreground">Members</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {project.unreadCount ?? 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Unread</div>
                </div>
              </div>

              {project.workspaceSlug && (
                <Link
                  href={`/dashboard/${project.workspaceSlug}/${project.slug}/tasks`}
                  className="group flex items-center gap-3 p-3 rounded-lg bg-background/60 hover:bg-background transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 dark:group-hover:bg-cyan-500/30 transition-colors">
                    <ExternalLink className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      Open
                    </div>
                    <div className="text-sm font-semibold group-hover:text-primary transition-colors">
                      Tasks
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Overview Section */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-5 w-5" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                {project.description ||
                  "No description available for this project."}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Status
                  </div>
                  <Badge
                    variant={statusColor[project.status || ""] || "secondary"}
                    className="font-medium">
                    {project.status === "isActive"
                      ? "Active"
                      : project.status || "Unknown"}
                  </Badge>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Priority
                  </div>
                  <Badge
                    variant={priorityColor[project.priority || ""] || "default"}
                    className="font-medium">
                    {project.priority || "Medium"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          {members.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="h-5 w-5" />
                    Team Members
                  </CardTitle>
                  <Badge variant="secondary" className="text-sm">
                    {members.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {visibleMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <Avatar className="h-10 w-10 border">
                        {member.image ? (
                          <AvatarImage src={member.image} alt={member.name} />
                        ) : (
                          <AvatarFallback className="text-sm">
                            {member.name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {member.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {member.role
                            ? member.role.charAt(0).toUpperCase() +
                              member.role.slice(1)
                            : "Member"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {remainingMembers > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="text-sm text-muted-foreground">
                      +{remainingMembers} more member
                      {remainingMembers !== 1 ? "s" : ""}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Owner */}
          {project.owner && (
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-base">Project Owner</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-background shadow-md">
                    {project.owner.image ? (
                      <AvatarImage
                        src={project.owner.image}
                        alt={project.owner.name || "Owner"}
                      />
                    ) : (
                      <AvatarFallback className="text-lg font-semibold">
                        {project.owner.name?.[0]?.toUpperCase() || "O"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base mb-1 truncate">
                      {project.owner.name || "Unknown User"}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {project.owner.email || "No email"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Info */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Tasks
                </span>
                <div className="text-2xl font-bold">
                  {project.taskCount ?? 0}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Unread</span>
                <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                  {project.unreadCount ?? 0}
                </div>
              </div>

              {project.createdAt && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Created
                    </span>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          {project.workspaceSlug && (
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-base">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-2">
                <Link
                  href={`/dashboard/${project.workspaceSlug}/${project.slug}/tasks`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-sm font-medium group">
                  <span>View Tasks</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href={`/dashboard/${project.workspaceSlug}/settings`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-sm font-medium group">
                  <span>Workspace Settings</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href={`/dashboard/${project.workspaceSlug}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-sm font-medium group">
                  <span>Back to Workspace</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
