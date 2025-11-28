"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateProjectInStore } from "@/lib/redux/slices/project";

/* shadcn components */
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/* icons */
import {
  MoreHorizontal,
  Pencil,
  Plus,
  UserPlus,
  Loader2,
  Trash,
} from "lucide-react";
import { mockProject } from "@/app/dashboard/[workspace]/[project]/mockdata";
import InviteMemberSheet from "../workspace/InviteMemberSheet";

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
};

export default function ProjectDetails({
  project: projectProp,
  members: membersProp,
  onUpdated,
  onDeleted,
}: {
  project?: Project;
  members?: Member[];
  onUpdated?: (p: Project) => void;
  onDeleted?: (id: string) => void;
}) {
  // allow passing project/members directly or reading from redux if not provided
  const dispatch = useAppDispatch();
  const storeProject = useAppSelector((s: any) => s.project?.activeProject) as
    | Project
    | undefined;

  const project = mockProject ?? projectProp ?? storeProject ?? ({} as Project);
  const members = membersProp ?? project.members ?? [];

  /* UI state */
  const [editingOpen, setEditingOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* edit form */
  const [name, setName] = useState(project.name || "");
  const [slug, setSlug] = useState(project.slug || "");
  const [description, setDescription] = useState(project.description || "");
  const [status, setStatus] = useState(project.status || "isActive");
  const [priority, setPriority] = useState(project.priority || "MEDIUM");

  /* invite state */
  const [allUsers, setAllUsers] = useState<Member[]>([]); // for invite sheet search
  const [selectedInvites, setSelectedInvites] = useState<
    { userId: string; role?: string }[]
  >([]);

  useEffect(() => {
    setName(project.name || "");
    setSlug(project.slug || "");
    setDescription(project.description || "");
    setStatus(project.status || "isActive");
    setPriority(project.priority || "MEDIUM");
  }, [project.id]);

  /* fetch potential users for invite sheet (simple) */
  useEffect(() => {
    // lazy fetch; adjust endpoint
    async function loadUsers() {
      try {
        const res = await axios.get("/user?limit=200", {
          withCredentials: true,
        });
        setAllUsers(res.data || []);
      } catch {
        setAllUsers([]);
      }
    }
    loadUsers();
  }, []);

  /* helpers */
  function autoSlug(s: string) {
    return s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  async function saveProjectChanges() {
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim(),
        status,
        priority,
      };
      const res = await axios.patch(`/project/${project.id}`, payload, {
        withCredentials: true,
      });
      // update store if you have action
      dispatch(updateProjectInStore(res.data));
      toastSuccess("Project updated");
      setEditingOpen(false);
      onUpdated?.(res.data);
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  }

  async function inviteSelectedUsers() {
    if (!selectedInvites.length) {
      toastError("Select at least one user to invite");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `/project/${project.id}/invite`,
        { members: selectedInvites },
        { withCredentials: true }
      );
      toastSuccess("Invites sent");
      setInviteOpen(false);
      setSelectedInvites([]);
      // merge members locally or refetch
      onUpdated?.(res.data);
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Failed to invite users");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject() {
    setLoading(true);
    try {
      await axios.delete(`/project/${project.id}`, { withCredentials: true });
      toastSuccess("Project deleted");
      onDeleted?.(project.id);
      setDeleteConfirmOpen(false);
    } catch (err: any) {
      toastError("Failed to delete project");
    } finally {
      setLoading(false);
    }
  }

  /* small toasts (local helpers) */
  function toastSuccess(msg: string) {
    try {
      toast.success(msg);
    } catch {
      /* noop if sonner not present */
    }
  }
  function toastError(msg: string) {
    try {
      toast.error(msg);
    } catch {
      /* noop */
    }
  }

  /* Subcomponents */

  function HeaderCard() {
    return (
      <div className="bg-card border rounded-md p-5 flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-primary/30 to-primary/10 rounded-full h-14 w-14 grid place-items-center">
            <span className="text-xl font-bold text-primary-foreground">
              {(project.name || "P").charAt(0)}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold truncate">
                {project.name}
              </h1>
              <div className="text-xs text-muted-foreground">
                /{project.slug}
              </div>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {project.description || "No description provided."}
            </p>

            <div className="mt-3 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">Tasks</div>
                <div className="font-medium">{project.taskCount ?? "—"}</div>
              </div>

              <Separator orientation="vertical" className="h-5 mx-2" />

              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">Members</div>
                <div className="font-medium">{members.length}</div>
              </div>

              {project.unreadCount ? (
                <>
                  <Separator orientation="vertical" className="h-5 mx-2" />
                  <div className="text-xs text-muted-foreground">Unread</div>
                  <div className="font-medium text-destructive">
                    {project.unreadCount}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={editingOpen} onOpenChange={setEditingOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            </DialogTrigger>
            <EditDialog />
          </Dialog>

          {/* <Sheet open={inviteOpen} onOpenChange={setInviteOpen}>
            <SheetTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setInviteOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" /> Invite
              </Button>
            </SheetTrigger> */}
          <InviteMemberSheet
            open={inviteOpen}
            workspaceId={project.id}
            disabled={false}
            onOpenChange={setInviteOpen}
            currentPath="PROJECT"
          />
          {/* </Sheet> */}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-44 p-0">
              <div className="flex flex-col p-1 text-sm">
                <button
                  onClick={() => setEditingOpen(true)}
                  className="text-left px-3 py-2 hover:bg-muted rounded">
                  Edit
                </button>
                <Link
                  href={`/dashboard/${project.workspaceSlug || "workspace"}/${
                    project.slug
                  }/tasks`}
                  className="px-3 py-2 hover:bg-muted rounded">
                  Open Tasks
                </Link>
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="text-left px-3 py-2 hover:bg-muted rounded text-destructive">
                  Delete
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }

  function EditDialog() {
    return (
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-1">
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium">Slug</label>
            <div className="flex gap-2">
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
              <Button variant="outline" onClick={() => setSlug(autoSlug(name))}>
                Auto
              </Button>
            </div>
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 g-2 ">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={(v) => setStatus(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="isActive">Active</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={(v) => setPriority(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setEditingOpen(false)}>
            Cancel
          </Button>
          <Button onClick={saveProjectChanges} disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}{" "}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  function InviteSheet() {
    return (
      <SheetContent side="right" className="w-[520px]">
        <SheetHeader>
          <SheetTitle>Invite members to project</SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-4">
          <div className="text-sm text-muted-foreground">
            Choose users to invite and assign a role (default member).
          </div>

          <div className="max-h-[56vh] overflow-auto border rounded p-2 space-y-2">
            {mockProject.members.map((u) => {
              const selected = selectedInvites.some((s) => s.userId === u.id);
              return (
                <div
                  key={u.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/40">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-8 w-8">
                      {u.image ? (
                        <AvatarImage src={u.image} />
                      ) : (
                        <AvatarFallback>{u.name?.[0]}</AvatarFallback>
                      )}
                    </Avatar>

                    <div className="min-w-0">
                      <div className="font-medium truncate">{u.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {u.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={
                        selected
                          ? selectedInvites.find((s) => s.userId === u.id)
                              ?.role || "member"
                          : undefined
                      }
                      onValueChange={(val) => {
                        if (selected) {
                          setSelectedInvites((prev) =>
                            prev.map((p) =>
                              p.userId === u.id ? { ...p, role: val } : p
                            )
                          );
                        } else {
                          setSelectedInvites((prev) => [
                            ...prev,
                            { userId: u.id, role: val },
                          ]);
                        }
                      }}>
                      <SelectTrigger className="w-36 h-8">
                        <SelectValue placeholder="Member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant={selected ? "outline" : "secondary"}
                      size="sm"
                      onClick={() => {
                        if (selected)
                          setSelectedInvites((prev) =>
                            prev.filter((p) => p.userId !== u.id)
                          );
                        else
                          setSelectedInvites((prev) => [
                            ...prev,
                            { userId: u.id, role: "member" },
                          ]);
                      }}>
                      {" "}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setInviteOpen(false);
                setSelectedInvites([]);
              }}>
              Cancel
            </Button>
            <Button onClick={inviteSelectedUsers} disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : null}{" "}
              Invite ({selectedInvites.length})
            </Button>
          </div>
        </div>
      </SheetContent>
    );
  }

  function MembersGrid() {
    const visible = members.slice(0, 8);
    const rest = Math.max(0, members.length - visible.length);
    return (
      <div className="bg-card border rounded-md p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Members</div>
            <div className="font-medium">{members.length}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite
          </Button>
        </div>

        <div className="flex items-center -space-x-3">
          {visible.map((m) => (
            <div
              key={m.id}
              title={`${m.name} • ${m.role || "member"}`}
              className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-background">
                {m.image ? (
                  <AvatarImage src={m.image} />
                ) : (
                  <AvatarFallback>{m.name?.[0]}</AvatarFallback>
                )}
              </Avatar>
            </div>
          ))}
          {rest > 0 && (
            <div className="h-10 w-10 rounded-full bg-muted text-xs grid place-items-center">
              +{rest}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Owner:{" "}
          <span className="font-medium ml-1">
            {project.owner?.name || project.ownerId}
          </span>
        </div>
      </div>
    );
  }

  function MetaPanel() {
    return (
      <aside className="space-y-4">
        <div className="bg-card border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Project</div>
              <div className="font-semibold">{project.name}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Unread</div>
              <div className="font-medium text-destructive">
                {project.unreadCount ?? 0}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground">Status</div>
              <div className="font-medium">{project.status}</div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground">Priority</div>
              <div className="font-medium">{project.priority}</div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground">Tasks</div>
              <div className="font-medium">{project.taskCount ?? "—"}</div>
            </div>
          </div>
        </div>

        <MembersGrid />

        <div className="bg-card border rounded-md p-4 text-sm">
          <div className="font-medium mb-2">Quick Links</div>
          <div className="flex flex-col gap-2">
            <Link
              href={`/dashboard/${project.workspaceSlug}/settings`}
              className="text-muted-foreground hover:text-foreground">
              Workspace settings
            </Link>
            <Link
              href={`/dashboard/${project.workspaceSlug}/chat`}
              className="text-muted-foreground hover:text-foreground">
              Workspace chat
            </Link>
          </div>
        </div>

        <div className="bg-card border rounded-md p-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="font-medium text-sm">Danger Zone</div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteConfirmOpen(true)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Delete or archive this project
          </div>
        </div>
      </aside>
    );
  }

  /* Delete Confirmation Dialog */
  function DeleteConfirmDialog() {
    return (
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
          </DialogHeader>

          <div className="py-2 text-sm text-muted-foreground">
            Deleting this project is permanent — tasks, chat and files will be
            removed.
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteProject}
              disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : null}{" "}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  /* main render */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <HeaderCard />

        {/* Description card */}
        <div className="bg-card border rounded-md p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Overview</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {project.description ||
                  "Add a description to share context about this project."}
              </p>
            </div>

            <div>
              <Badge>{project.status}</Badge>
            </div>
          </div>
        </div>

        {/* Tasks preview card */}
        <div className="bg-card border rounded-md p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent activity & tasks</h3>
            <Link
              href={`/dashboard/${project.workspaceSlug}/${project.slug}/tasks`}
              className="text-sm text-muted-foreground hover:text-foreground">
              View all
            </Link>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {/* placeholder: replace with real tasks list */}
            {project.taskCount ? (
              <div>{project.taskCount} tasks — show latest 5 here.</div>
            ) : (
              <div>No tasks yet.</div>
            )}
          </div>
        </div>
      </div>

      <MetaPanel />

      <DeleteConfirmDialog />
    </div>
  );
}
