"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api/api";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  updateWorkspace,
  addProjectToWorkspace,
  // ensure these exist in your slice
} from "@/lib/redux/slices/workspace";

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
  Plus,
  UserPlus,
  Forward,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { ProjectSettingsDialog } from "./ProjectSettingsDialog";
import { useParams } from "next/navigation";
import { EmptyDemo } from "../project/EmptyProjects";
import { Project, User, Workspace, WorkspaceMember } from "@prisma/client";
import InviteMemberSheet from "./InviteMemberSheet";
import { UserWorkspaceRoles } from "@/lib/redux/slices/userSlice";

interface IExtendedWorkspceMembers extends WorkspaceMember {
  user: User;
}
interface IProp extends Workspace {
  owner: User;
  projects: Project[];
  unreadCount?: number;
  members: IExtendedWorkspceMembers[];
  _count: { members: number };
}

export default function WorkspaceDetails({ workspace }: { workspace: IProp }) {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { workspaces, activeWorkspaceId } = useAppSelector(
    (s: any) => s.workspace
  );
  console.log(params);
  const { workspaceRoles }: { workspaceRoles: UserWorkspaceRoles[] } =
    useAppSelector((s: any) => s.user.userRoles);
  // const workspace = useMemo(
  //   () =>
  //     workspaces?.find((w: any) => w.slug === params.workspace?.toString()) ??
  //     null,
  //   [params]
  // );

  // ui state
  const [editing, setEditing] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [addingProject, setAddingProject] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  // form states
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // invite form local state
  const [inviteSelected, setInviteSelected] = useState<
    { userId: string; role?: string }[]
  >([]);
  const [allMembers, setAllMembers] = useState<any[]>([]); // fetched members / possible invites

  // transfer form state
  const [newOwnerId, setNewOwnerId] = useState<string | null>(null);

  // new project name
  const [newProjectName, setNewProjectName] = useState("");
  const userRole = !(
    workspaceRoles?.find((ws: any) => ws.workspaceId == workspace?.id)?.role ===
      "ADMIN" ||
    workspaceRoles?.find((ws: any) => ws.workspaceId == workspace?.id)?.role ===
      "OWNER" ||
    workspaceRoles?.find((ws: any) => ws.workspaceId == workspace?.id)?.role ===
      "MAINTAINER"
  );

  useEffect(() => {
    if (!workspace) return;
    setFormName(workspace.name ?? "");
    setFormSlug(workspace.slug ?? "");
    setFormDescription(workspace.description ?? "");
  }, [fetchWorkspaceMembers]);

  // useEffect(() => {
  //   fetchWorkspaceMembers();
  // });

  async function fetchWorkspaceMembers() {
    if (!workspace) return;
    try {
      const res = await api.get(`/workspace/${workspace.id}/members`, {
        withCredentials: true,
      });
      console.log(res.data);
      setAllMembers(res.data.members);
    } catch (err) {
      setAllMembers([]);
    }
  }

  if (!workspace) {
    return (
      <div className="p-6 bg-card border rounded-md min-h-[220px] flex items-center justify-center">
        <div className="text-sm text-muted-foreground">
          No workspace selected
        </div>
      </div>
    );
  }

  // ---------- actions ----------
  async function saveWorkspace() {
    setLoadingAction(true);
    try {
      const payload = {
        id: workspace.id,
        name: formName.trim(),
        slug: formSlug.trim(),
        description: formDescription?.trim(),
      };
      // optimistic
      dispatch(updateWorkspace({ id: workspace.id, data: payload }));
      const res = await api.patch(`/workspace/${workspace.id}`, payload, {
        withCredentials: true,
      });
      dispatch(updateWorkspace({ id: workspace.id, data: res.data }));
      setEditing(false);
      toast.success("Workspace updated");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update workspace");
    } finally {
      setLoadingAction(false);
    }
  }

  async function inviteMembers() {
    if (!inviteSelected.length) {
      toast.error("Select members to invite");
      return;
    }
    setLoadingAction(true);
    try {
      const body = {
        members: inviteSelected.map((m) => ({
          userId: m.userId,
          role: m.role || "member",
        })),
      };
      const res = await api.post(`/workspace/${workspace.id}/invite`, body, {
        withCredentials: true,
      });
      dispatch(
        updateWorkspace({
          id: workspace.id,
          data: { members: res.data.members },
        })
      );
      toast.success("Invitations sent");
      setInviteOpen(false);
      setInviteSelected([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to invite members");
    } finally {
      setLoadingAction(false);
    }
  }

  async function transferOwner() {
    if (!newOwnerId) {
      toast.error("Select a member");
      return;
    }
    setLoadingAction(true);
    try {
      const res = await api.post(
        `/workspace/${workspace.id}/transfer`,
        { newOwnerId },
        { withCredentials: true }
      );
      dispatch(updateWorkspace({ id: workspace.id, data: res.data }));
      toast.success("Ownership transferred");
      setTransferOpen(false);
      setNewOwnerId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to transfer ownership");
    } finally {
      setLoadingAction(false);
    }
  }

  // ---------- small helpers ----------
  function slugify(s: string) {
    return s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  // ---------- subcomponents ----------
  function ProjectCard({ proj }: { proj: any }) {
    return (
      <div className="bg-card border rounded-md p-3 hover:shadow-sm transition flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link
              href={`/dashboard/${workspace.slug}/${proj.slug}/tasks`}
              className="block font-medium truncate">
              {proj.name}
            </Link>
            <div className="text-xs text-muted-foreground mt-1">
              Tasks:{" "}
              <span className="font-medium">{proj.taskCount ?? "—"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {proj.unreadCount > 0 && (
              <Badge className="text-xs">{proj.unreadCount}</Badge>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button aria-label="Project actions" size="sm" title="Actions">
                  <MoreHorizontal size={14} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-44 p-0">
                <div className="flex flex-col p-1 text-sm">
                  <Link
                    href={`/dashboard/${workspace.slug}/${proj.slug}/tasks`}
                    className="px-3 py-2 hover:bg-muted rounded">
                    Open Tasks
                  </Link>
                  <Link
                    href={`/dashboard/${workspace.slug}/${proj.slug}/chat`}
                    className="px-3 py-2 hover:bg-muted rounded">
                    Open Chat
                  </Link>
                  {!userRole && (
                    <ProjectSettingsDialog
                      disable={userRole}
                      project={proj}
                      onUpdated={(updated) => {}}
                      onDeleted={(id) => {}}>
                      <button
                        className="
      w-full flex items-center justify-between 
      px-3 py-2 text-sm rounded 
      hover:bg-muted transition
    ">
                        <span>Settings</span>
                        <MoreHorizontal className="h-4 w-4 opacity-70" />
                      </button>
                    </ProjectSettingsDialog>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    );
  }

  function MemberAvatarGrid({ members }: { members: any[] }) {
    const visible = members?.slice(0, 8) || [];
    const rest = Math.max(0, (members?.length || 0) - visible.length);

    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-3">
          {visible.map((m: any) => (
            <div key={m.id} className="relative">
              <Avatar className="h-9 w-9 ring-2 ring-background">
                {m.user.image ? (
                  <AvatarImage src={m.user.image} />
                ) : (
                  <AvatarFallback>{m.user.name?.[0]}</AvatarFallback>
                )}
              </Avatar>
            </div>
          ))}
          {rest > 0 && (
            <div className="h-9 w-9 rounded-full bg-muted text-xs grid place-items-center">
              +{workspace._count.members}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- render ----------
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* MAIN: overview + projects */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="bg-card border gap-6 grid sm:grid-rows-2 rounded-md p-5 lg:flex items-start justify-between ">
          <div className="flex items-start gap-4">
            <div>
              <div className="bg-gradient-to-br from-primary/40 to-primary/20 rounded-full h-14 w-14 grid place-items-center">
                <span className="text-xl font-bold text-primary-foreground">
                  {(workspace.name || "").charAt(0)}
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold truncate">
                  {workspace.name}
                </h1>
                <div className="text-xs text-muted-foreground hidden lg:block ">
                  /{workspace.slug}
                </div>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {workspace.description || "No description yet."}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="text-xs text-muted-foreground">Projects</div>
                <div className="text-sm font-medium">
                  {(workspace.projects || []).length}
                </div>

                <Separator orientation="vertical" className="h-5 mx-2" />

                <div className="text-xs text-muted-foreground">Members</div>
                <div className="text-sm font-medium">
                  {workspace._count.members}
                </div>

                {workspace.unreadCount! > 0 && (
                  <>
                    <Separator orientation="vertical" className="h-5 mx-2" />
                    <div className="text-xs text-muted-foreground">Unread</div>
                    <div className="text-sm font-medium text-destructive">
                      {workspace?.unreadCount || 0}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {!userRole && (
            <div className="flex items-center gap-2 h-fit">
              <Dialog open={editing} onOpenChange={setEditing}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(true)}
                    disabled={userRole}>
                    <Pencil size={14} /> Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit workspace</DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-3 py-2">
                    <label className="text-xs text-muted-foreground">
                      Name
                    </label>
                    <Input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />

                    <label className="text-xs text-muted-foreground">
                      Slug
                    </label>
                    <Input
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                    />

                    <label className="text-xs text-muted-foreground">
                      Description
                    </label>
                    <Textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                    />
                  </div>

                  <DialogFooter className="flex gap-2">
                    <Button variant="ghost" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={saveWorkspace}
                      disabled={loadingAction || userRole}>
                      {loadingAction ? (
                        <Loader2 className="animate-spin mr-2" />
                      ) : null}
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <InviteMemberSheet
                open={inviteOpen}
                onOpenChange={setInviteOpen}
                workspaceId={workspace.id}
                onInvite={async (members) => {
                  await api.post(`/workspace/${workspace.id}/invite`, {
                    members,
                  });
                }}
                disabled={userRole}
                currentPath="WORKSPACE"
              />
              <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTransferOpen(true)}
                    disabled={userRole}>
                    <Forward size={14} /> Transfer
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transfer ownership</DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-3 py-2">
                    <div className="text-sm text-muted-foreground">
                      Choose a new owner
                    </div>
                    <div className="max-h-[40vh] overflow-auto border rounded p-2">
                      {(workspace.members || [])
                        .filter((m) => m.id !== workspace.ownerId)
                        .map((m) => (
                          <label
                            key={m.id}
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-muted/30 ${
                              newOwnerId === m.id ? "bg-accent/30" : ""
                            }`}>
                            <input
                              type="radio"
                              name="newOwner"
                              checked={newOwnerId === m.id}
                              onChange={() => setNewOwnerId(m.id)}
                            />
                            <Avatar className="h-8 w-8">
                              {m.user.image ? (
                                <AvatarImage src={m.user.image} />
                              ) : (
                                <AvatarFallback>
                                  {m.user.name?.[0]}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="font-medium">{m.user.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {m.user.email}
                              </div>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>

                  <DialogFooter className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setTransferOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={transferOwner} disabled={loadingAction}>
                      {loadingAction ? (
                        <Loader2 className="animate-spin mr-2" />
                      ) : null}{" "}
                      Transfer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {workspace.projects.length > 0 ? (
          <div className="grid gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(workspace.projects || []).map((p: any) => (
                <ProjectCard key={p.id} proj={p} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid">
            {!userRole && (
              <div className="grid place-items-center">
                <EmptyDemo />
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: meta / members */}
      <aside className="space-y-6">
        <div className="bg-card border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Workspace</div>
              <div className="font-semibold">{workspace.name}</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted-foreground">Unread</div>
              <div className="font-medium text-destructive">
                {workspace.unreadCount || 0}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Members</div>
              {!userRole && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setInviteOpen(true)}>
                  Invite
                </Button>
              )}
            </div>

            <div className="mt-3">
              <MemberAvatarGrid members={workspace.members || []} />
            </div>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">Owner</div>
          <div className="mt-2 flex items-center gap-3">
            <Avatar className="h-9 w-9">
              {workspace.owner?.image ? (
                <AvatarImage src={workspace.owner.image} />
              ) : (
                <AvatarFallback>{workspace.owner?.name?.[0]}</AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0">
              <div className="font-medium">{workspace.owner?.name}</div>
              <div className="text-xs text-muted-foreground">
                {workspace.owner?.email || ""}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-md p-4 text-sm">
          <div className="font-medium mb-2">Quick Links</div>
          <div className="flex flex-col gap-2">
            <Link
              href={`/dashboard/${workspace.slug}/settings`}
              className="text-muted-foreground hover:text-foreground">
              Workspace settings
            </Link>
            <Link
              href={`/dashboard/${workspace.slug}/members`}
              className="text-muted-foreground hover:text-foreground">
              Manage members
            </Link>
            <Link
              href={`/dashboard/${workspace.slug}/analytics`}
              className="text-muted-foreground hover:text-foreground">
              Analytics
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
