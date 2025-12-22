"use client";

import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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
  Calendar,
  Activity,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Project {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  status?: string;
  taskCount?: number;
  unreadCount?: number;
}

interface WorkspaceMember {
  id: string;
  role?: string;
  user: User;
}

interface WorkspaceDetailsProps {
  workspace: {
    id: string;
    name: string;
    slug?: string | null;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    priority?: string;
    unreadCount?: number;
    owner?: User;
    projects?: Project[];
    members?: WorkspaceMember[];
    _count?: { members: number };
  };
  userRole?: string;
}

export default function WorkspaceDetails({
  workspace,
  userRole = "MEMBER",
}: WorkspaceDetailsProps) {
  console.log("worksapce", workspace);

  if (!workspace) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <FolderKanban className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                No Workspace Selected
              </h3>
              <p className="text-sm text-muted-foreground">
                Please select a workspace to view its details
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalTasks =
    workspace.projects?.reduce((sum, p) => sum + (p.taskCount ?? 0), 0) ?? 0;
  const totalUnread =
    workspace.projects?.reduce((sum, p) => sum + (p.unreadCount ?? 0), 0) ?? 0;
  const memberCount =
    workspace._count?.members || workspace.members?.length || 0;

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <Card className="overflow-hidden border-2 shadow-sm">
        <div className="bg-gradient-to-br ">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Workspace Icon & Title */}
              <div className="flex gap-6 items-start flex-1">
                <div className="relative shrink-0">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-700 to-slate-600 dark:from-slate-100 dark:via-slate-300 dark:to-slate-400 flex items-center justify-center shadow-xl ring-4 ring-background">
                    <span className="text-3xl font-bold text-white dark:text-slate-900">
                      {(workspace.name || "W").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {workspace.isActive && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-4 border-background shadow-lg flex items-center justify-center">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Active Workspace</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                      {workspace.name}
                    </h1>
                    {workspace.priority && (
                      <Badge
                        variant={
                          workspace.priority === "HIGH"
                            ? "destructive"
                            : workspace.priority === "MEDIUM"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs font-semibold">
                        {workspace.priority}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="font-mono text-xs">
                      /{workspace.slug}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {userRole}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground leading-relaxed max-w-3xl">
                    {workspace.description ||
                      "No description available for this workspace."}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                  <FolderKanban className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {workspace.projects?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{memberCount}</div>
                  <div className="text-xs text-muted-foreground">Members</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalTasks}</div>
                  <div className="text-xs text-muted-foreground">
                    Total Tasks
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/60">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalUnread}</div>
                  <div className="text-xs text-muted-foreground">Unread</div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Projects Section */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FolderKanban className="h-5 w-5" />
                  Projects
                </CardTitle>
                <Badge variant="secondary" className="text-sm">
                  {workspace.projects?.length || 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {workspace.projects && workspace.projects.length > 0 ? (
                <div className="space-y-3">
                  {workspace.projects.map((proj) => (
                    <Link
                      key={proj.id}
                      href={`/dashboard/${workspace.slug}/${proj.slug}/tasks`}
                      className="block group">
                      <Card className="border-2 hover:border-primary/50 hover:shadow-md transition-all duration-200">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                  {proj.name}
                                </h3>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                              </div>

                              {proj.description && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {proj.description}
                                </p>
                              )}

                              <div className="flex flex-wrap items-center gap-3">
                                {proj.status && (
                                  <Badge variant="outline" className="text-xs">
                                    {proj.status}
                                  </Badge>
                                )}
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span className="font-medium">
                                    {proj.taskCount ?? 0}
                                  </span>
                                  <span>tasks</span>
                                </div>
                                {proj.unreadCount && proj.unreadCount > 0 && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs">
                                    {proj.unreadCount} unread
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted/50 mb-4">
                    <FolderKanban className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No Projects Yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This workspace doesn't have any projects yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Workspace Owner */}
          {workspace.owner && (
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-base">Workspace Owner</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-background shadow-md">
                    {workspace.owner.image ? (
                      <AvatarImage
                        src={workspace.owner.image}
                        alt={workspace.owner.name || "Owner"}
                      />
                    ) : (
                      <AvatarFallback className="text-lg font-semibold">
                        {workspace.owner.name?.[0]?.toUpperCase() || "O"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base mb-1 truncate">
                      {workspace.owner.name || "Unknown User"}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {workspace.owner.email || "No email"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team Members */}
          {workspace.members && workspace.members.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Team Members
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {memberCount}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {workspace.members.slice(0, 8).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <Avatar className="h-10 w-10 border">
                        {member.user.image ? (
                          <AvatarImage
                            src={member.user.image}
                            alt={member.user.name || "Member"}
                          />
                        ) : (
                          <AvatarFallback className="text-sm">
                            {member.user.name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {member.user.name || "Unknown"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {member.role || "Member"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {workspace.members.length > 8 && (
                  <>
                    <Separator className="my-4" />
                    <Link
                      href={`/dashboard/${workspace.slug}/members`}
                      className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline">
                      View all {memberCount} members
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Workspace Info */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant={workspace.isActive ? "default" : "secondary"}
                  className="font-medium">
                  {workspace.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(workspace.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Updated</span>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  {new Date(workspace.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
