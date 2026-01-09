"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import {
  Pencil,
  MoreHorizontal,
  Loader2,
  FolderKanban,
  Users,
  Settings,
  BarChart3,
  MessageSquare,
  CheckSquare,
  Clock,
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
  onUpdate?: (data: any) => Promise<void>;
}

export default function WorkspaceDetails({
  workspace,
  userRole = "MEMBER",
  onUpdate,
}: WorkspaceDetailsProps) {
  const [editing, setEditing] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [formName, setFormName] = useState(workspace.name || "");
  const [formSlug, setFormSlug] = useState(workspace.slug || "");
  const [formDescription, setFormDescription] = useState(
    workspace.description || ""
  );

  const canEdit = ["ADMIN", "OWNER", "MAINTAINER"].includes(userRole);

  if (!workspace) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              No workspace selected
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function saveWorkspace() {
    setLoadingAction(true);
    try {
      const payload = {
        name: formName.trim(),
        slug: formSlug.trim(),
        description: formDescription?.trim(),
      };

      if (onUpdate) {
        await onUpdate(payload);
      }

      setEditing(false);
      toast.success("Workspace updated successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update workspace");
    } finally {
      setLoadingAction(false);
    }
  }

  function ProjectCard({ proj }: { proj: Project }) {
    return (
      <Card className="group hover:shadow-md transition-all duration-200 hover:border-primary/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <Link
                href={`/workspace/${workspace.slug}/proeject/${proj.slug}`}
                className="font-semibold text-base hover:text-primary transition-colors line-clamp-1">
                {proj.name}
              </Link>
              {proj.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {proj.description}
                </p>
              )}
            </div>

            {canEdit && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-1" align="end">
                  <div className="flex flex-col text-sm">
                    <Link
                      href={`/workspace/${workspace.slug}/project/${proj.slug}/tasks`}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-sm transition-colors">
                      <CheckSquare className="h-4 w-4" />
                      Open Tasks
                    </Link>
                    <Link
                      href={`/workspace/${workspace.slug}/project/${proj.slug}/chat`}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-sm transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      Open Chat
                    </Link>
                    <Separator className="my-1" />
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-sm transition-colors text-left w-full">
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckSquare className="h-3.5 w-3.5" />
              <span>{proj.taskCount ?? 0} tasks</span>
            </div>
            {proj.unreadCount && proj.unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 text-xs">
                {proj.unreadCount} unread
              </Badge>
            )}
            {proj.status && (
              <Badge variant="secondary" className="h-5 text-xs">
                {proj.status}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  function MembersList({ members }: { members: WorkspaceMember[] }) {
    const displayMembers = members?.slice(0, 12) || [];
    const remaining = Math.max(0, (members?.length || 0) - 12);

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {displayMembers.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors">
              <Avatar className="h-8 w-8">
                {m.user.image ? (
                  <AvatarImage src={m.user.image} alt={m.user.name || ""} />
                ) : (
                  <AvatarFallback className="text-xs">
                    {m.user.name?.[0] || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {m.user.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {m.role || "Member"}
                </div>
              </div>
            </div>
          ))}
        </div>
        {remaining > 0 && (
          <div className="text-center pt-2">
            <Link
              href={`/dashboard/${workspace.slug}/members`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View {remaining} more member{remaining !== 1 ? "s" : ""}
            </Link>
          </div>
        )}
      </div>
    );
  }

  const EmptyProjects = () => (
    <div className="text-center py-12 text-muted-foreground">
      <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-50" />
      <p className="text-lg font-medium mb-1">No projects yet</p>
      <p className="text-sm">Create your first project to get started</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="relative">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {(workspace.name || "W").charAt(0).toUpperCase()}
                  </span>
                </div>
                {workspace.isActive && (
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                    {workspace.name}
                  </h1>
                  <Badge variant="outline" className="font-mono text-xs">
                    /{workspace.slug}
                  </Badge>
                  {workspace.priority && (
                    <Badge
                      variant={
                        workspace.priority === "HIGH"
                          ? "destructive"
                          : workspace.priority === "MEDIUM"
                          ? "default"
                          : "secondary"
                      }>
                      {workspace.priority}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
                  {workspace.description || "No description provided."}
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {workspace.projects?.length || 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Project{workspace.projects?.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <Separator orientation="vertical" className="h-4" />

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {workspace._count?.members ||
                        workspace.members?.length ||
                        0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Member
                      {(workspace._count?.members ||
                        workspace.members?.length) !== 1
                        ? "s"
                        : ""}
                    </span>
                  </div>

                  {workspace.unreadCount && workspace.unreadCount > 0 && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">
                          {workspace.unreadCount}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Unread
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {canEdit && (
              <Dialog open={editing} onOpenChange={setEditing}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Workspace
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Workspace</DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Workspace Name
                      </label>
                      <Input
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Enter workspace name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Slug</label>
                      <Input
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                        placeholder="workspace-slug"
                      />
                      <p className="text-xs text-muted-foreground">
                        Used in URLs. Only lowercase letters, numbers, and
                        hyphens.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Describe your workspace"
                        rows={4}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setEditing(false)}
                      disabled={loadingAction}>
                      Cancel
                    </Button>
                    <Button onClick={saveWorkspace} disabled={loadingAction}>
                      {loadingAction && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Projects Section */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="h-5 w-5" />
                  Projects
                </CardTitle>
                <Badge variant="secondary">
                  {workspace.projects?.length || 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {workspace.projects && workspace.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workspace.projects.map((p) => (
                    <ProjectCard key={p.id} proj={p} />
                  ))}
                </div>
              ) : (
                <EmptyProjects />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Card */}
          {workspace.owner && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Workspace Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    {workspace.owner.image ? (
                      <AvatarImage
                        src={workspace.owner.image}
                        alt={workspace.owner.name || ""}
                      />
                    ) : (
                      <AvatarFallback className="text-base">
                        {workspace.owner.name?.[0] || "O"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">
                      {workspace.owner.name || "Unknown"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {workspace.owner.email || ""}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Members Card */}
          {workspace.members && workspace.members.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Team Members
                  </CardTitle>
                  <Badge variant="secondary">
                    {workspace._count?.members || workspace.members.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <MembersList members={workspace.members} />
                <Separator className="my-4" />
                <Link
                  href={`/dashboard/${workspace.slug}/members`}
                  className="text-sm text-primary hover:underline">
                  View all members
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <Link
                href={`/dashboard/${workspace.slug}/settings`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-sm">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Workspace Settings</span>
              </Link>
              <Link
                href={`/dashboard/${workspace.slug}/members`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Manage Members</span>
              </Link>
              <Link
                href={`/dashboard/${workspace.slug}/analytics`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-sm">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span>Analytics</span>
              </Link>
            </CardContent>
          </Card>

          {/* Workspace Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={workspace.isActive ? "default" : "secondary"}>
                  {workspace.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(workspace.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(workspace.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
