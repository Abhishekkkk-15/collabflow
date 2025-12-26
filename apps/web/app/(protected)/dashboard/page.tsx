"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  Trash2,
  Plus,
  Settings,
  Users,
  FolderKanban,
  Shield,
  AlertTriangle,
  Lock,
  Globe,
  Loader2,
  BackpackIcon,
  ChevronLeft,
  Archive,
  PauseCircle,
  ArrowDown,
  Minus,
  ArrowUp,
  PlusCircleIcon,
  PlusIcon,
} from "lucide-react";
import MembersTable from "@/components/dashboard/MembersTable";
import InviteMemberSheet, {
  InviteEntry,
} from "@/components/workspace/InviteMemberSheet";
import { api } from "@/lib/api/api";
import { toast } from "sonner";
import { setWorkspaces as useWSs } from "@/lib/redux/slices/workspace";
import { useDispatch } from "react-redux";
import {
  Project,
  Workspace,
  WorkspaceMember,
  WorkspacePermission,
  WorkspaceRole,
} from "@prisma/client";
import { useUser, useUserRoles } from "@/lib/redux/hooks/use-user";
import { EmptyDemo } from "@/components/project/EmptyProjects";
import { CreateProjectDialog } from "@/components/self/CreateProjectDialog";

type EWorkspace = Workspace & {
  projects: Project[];
  permissions: WorkspacePermission;
};
type Status = "DRAFT" | "isActive" | "PAUSED" | "COMPLETED" | "ARCHIVED";
type Priority = "LOW" | "MEDIUM" | "HIGH";

export default function WorkspaceDashboard() {
  const [workspaces, setWorkspaces] = useState<EWorkspace[]>([]);

  const [selectedWorkspace, setSelectedWorkspace] = useState<EWorkspace | null>(
    null
  );
  const dispatch = useDispatch();
  const [projects, setProjects] = useState<Project[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState<WorkspacePermission>();
  const [openCreateProjectDialog, setOpenCreateProjectDialog] = useState(false);
  const { workspaceRoles } = useUserRoles();
  const user = useUser();

  const [isOwner, setIsOwner] = useState(false);

  async function fetchWorkspace() {
    try {
      const res = await api.get("/workspace/dashboard");
      console.log("dashboard : ", res);
      setWorkspaces(res.data);
      setSelectedWorkspace(res.data[0] ?? null);
      dispatch(useWSs(res.data));
    } catch (error: any) {
      toast.error("Failed to load workspaces", error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkspace();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      setProjects(selectedWorkspace?.projects);
      console.log("permissions ", selectedWorkspace.permissions);
      setPermissions(selectedWorkspace.permissions);
      let roles = workspaceRoles.find(
        (w) => w.workspaceId == selectedWorkspace?.id
      );
      console.log("ro", roles);
      setIsOwner(selectedWorkspace.ownerId == user.id);
    }
  }, [selectedWorkspace]);

  const handleSave = async () => {
    if (permissions?.canModifySettings == false || permissions == null) return;
    setSaving(true);
    const payload = {
      name: selectedWorkspace?.name,
      description: selectedWorkspace?.description,
      status: selectedWorkspace?.status,
      priority: selectedWorkspace?.priority,
    };
    try {
      await api.patch(`/workspace/${selectedWorkspace?.slug!}`, payload);
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async (members: InviteEntry[]) => {
    if (permissions?.canInviteMembers == false) return;
    try {
      await api.post(
        `/invite/workspace/${selectedWorkspace?.id}?wsSlug=${selectedWorkspace?.slug}`,
        {
          members,
        }
      );
    } catch (error) {}
  };

  const handleDelete = async () => {
    if (permissions?.canDeleteResources == false) return;
    try {
      await api.delete(`/workspace/${selectedWorkspace?.slug}`);
      toast.info(selectedWorkspace?.name + " Workspace deleted successfully");
    } catch (error) {
      toast.error(
        "Error Deleting workspace, Try again or check you permissions"
      );
    }
  };

  const handleChangeRole = async (id: string, new_role: WorkspaceRole) => {
    try {
      const payload = {
        id: id,
        workspaceId: selectedWorkspace?.id,
        role: new_role,
      };

      console.log(id, selectedWorkspace?.id, new_role);
      await api.patch("/workspace/members/role", payload);
      toast.info("Role changed");
    } catch (error) {}
  };

  const handleRemoveMember = async (id: string) => {
    console.log("p", !permissions?.canInviteMembers, !isOwner);
    if (permissions?.canInviteMembers == false || isOwner == false)
      return toast.error("Not allowed");
    try {
      api.delete(`/workspace/members/${id}/remove`);
    } catch (error) {}
  };

  const handleChangePermission = async (per: Partial<WorkspacePermission>) => {
    if (!isOwner) return toast.error("Not allowed");
    try {
      api.patch(`/workspace/${selectedWorkspace?.id}/permissions`, per);
      toast.info("Permission changed");
    } catch (error) {
      toast.error("Error while changing permission");
    }
  };
  // canCreateProject: boolean;
  //     canInviteMembers: boolean;
  //     canModifySettings: boolean;
  //     canDeleteResources: boolean;
  type WorkspacePermissionKey =
    | "canCreateProject"
    | "canInviteMembers"
    | "canModifySettings"
    | "canDeleteResources";

  function hasWorkspacePermission(key: WorkspacePermissionKey) {
    if (!permissions) return;
    if (isOwner) return true;
    return permissions![key] == true;
  }

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "outline" => {
    const statusLower = status.toLowerCase();
    if (statusLower === "active") return "default";
    if (statusLower === "archived") return "secondary";
    return "outline";
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!selectedWorkspace) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Settings className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No workspaces found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You don't have any owned workspaces yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Workspace Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your workspace configuration and team
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={!hasWorkspacePermission("canModifySettings")}
            size="lg"
            className="gap-2 shadow-sm">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="mb-8">
          <Label htmlFor="workspace-select" className="text-sm font-medium">
            Current Workspace
          </Label>
          <Select
            value={selectedWorkspace.slug!}
            onValueChange={(value) => {
              const ws = workspaces.find((w) => w.slug === value);
              if (ws) setSelectedWorkspace(ws);
            }}>
            <SelectTrigger
              id="workspace-select"
              className="mt-2 w-full sm:max-w-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((ws) => (
                <SelectItem key={ws.id} value={ws.slug!}>
                  <div className="flex items-center gap-2">
                    {ws.status == "DRAFT" ? (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    {ws.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-grid sm:grid-cols-5">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Members</span>
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="gap-2"
              onClick={() => setProjects(selectedWorkspace.projects)}>
              <FolderKanban className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="danger" className="gap-2" disabled={!isOwner}>
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Danger</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workspace Information</CardTitle>
                <CardDescription>
                  Update your workspace details and visibility settings
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="workspace-name">Workspace Name</Label>
                    <Input
                      id="workspace-name"
                      value={selectedWorkspace.name}
                      disabled={!hasWorkspacePermission("canModifySettings")}
                      onChange={(e) =>
                        setSelectedWorkspace({
                          ...selectedWorkspace,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter workspace name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workspace-slug">Workspace Slug</Label>
                    <Input
                      id="workspace-slug"
                      value={selectedWorkspace.slug!}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Slug cannot be changed after creation
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workspace-description">Description</Label>
                  <Textarea
                    id="workspace-description"
                    value={selectedWorkspace.description ?? ""}
                    disabled={!hasWorkspacePermission("canModifySettings")}
                    onChange={(e) =>
                      setSelectedWorkspace({
                        ...selectedWorkspace,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe your workspace purpose and goals..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Help team members understand what this workspace is for
                  </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      disabled={!hasWorkspacePermission("canModifySettings")}
                      value={selectedWorkspace.status}
                      onValueChange={(value) =>
                        setSelectedWorkspace({
                          ...selectedWorkspace,
                          status: value as Status,
                        })
                      }
                      defaultValue={selectedWorkspace.status}>
                      <SelectTrigger
                        id="workspace-status"
                        className="mt-2 w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="isActive">
                          <div className="flex items-center gap-2">Active</div>
                        </SelectItem>

                        <SelectItem value="DRAFT">
                          <div className="flex items-center gap-2">DRAFT</div>
                        </SelectItem>

                        <SelectItem value="PAUSED">
                          <div className="flex items-center gap-2">PAUSED</div>
                        </SelectItem>
                        <SelectItem value="COMPLETED">
                          <div className="flex items-center gap-2">
                            COMPLETED
                          </div>
                        </SelectItem>
                        <SelectItem value="ARCHIVED">
                          <div className="flex items-center gap-2">
                            ARCHIVED
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      disabled={!hasWorkspacePermission("canModifySettings")}
                      value={selectedWorkspace.priority}
                      onValueChange={(value) =>
                        setSelectedWorkspace({
                          ...selectedWorkspace,
                          priority: value as "LOW" | "MEDIUM" | "HIGH",
                        })
                      }
                      defaultValue={selectedWorkspace.priority}>
                      <SelectTrigger
                        id="workspace-priority"
                        className="mt-2 w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="LOW">
                          <div className="flex items-center gap-2">Low</div>
                        </SelectItem>

                        <SelectItem value="MEDIUM">
                          <div className="flex items-center gap-2">Medium</div>
                        </SelectItem>

                        <SelectItem value="HIGH">
                          <div className="flex items-center gap-2">High</div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />

                <div className="flex items-start justify-between gap-4 rounded-lg border bg-muted/50 p-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">Private Workspace</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      When enabled, only invited members can discover and access
                      this workspace
                    </p>
                  </div>
                  <Switch
                    disabled={!hasWorkspacePermission("canModifySettings")}
                    checked={selectedWorkspace.isActive}
                    onCheckedChange={(v) =>
                      setSelectedWorkspace({
                        ...selectedWorkspace,
                        isActive: v,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Invite and manage people who can access this workspace
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => setInviteOpen(true)}
                    disabled={!hasWorkspacePermission("canInviteMembers")}>
                    <Plus className="h-4 w-4" />
                    Invite Member
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <MembersTable
                  workspaceSlug={selectedWorkspace.id!}
                  onRoleChange={handleChangeRole}
                  onRemove={handleRemoveMember}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>
                      All projects created within this workspace
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {projects.length}{" "}
                      {projects.length === 1 ? "project" : "projects"}
                    </Badge>
                    {hasWorkspacePermission("canCreateProject") && (
                      <PlusIcon
                        className="cursor-pointer disabled:true"
                        onClick={() =>
                          setOpenCreateProjectDialog(!openCreateProjectDialog)
                        }
                      />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    {/* <FolderKanban className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">
                      No projects yet
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Projects created in this workspace will appear here
                    </p> */}
                    <EmptyDemo
                      workspaceId={selectedWorkspace.id}
                      disabled={!hasWorkspacePermission("canCreateProject")}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">{project.name}</p>
                          <p className="text-xs text-muted-foreground">
                            /{project.slug}
                          </p>
                        </div>
                        <Badge variant={getStatusVariant(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>Member Permissions</CardTitle>
                <CardDescription>
                  Control what members can do within this workspace
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Create Projects</p>
                      <p className="text-sm text-muted-foreground">
                        Allow members to create new projects in this workspace
                      </p>
                    </div>
                    <Switch
                      defaultChecked={permissions?.canCreateProject}
                      disabled={!isOwner}
                      onClick={() =>
                        handleChangePermission({
                          canCreateProject: !permissions?.canCreateProject,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Invite Members</p>
                      <p className="text-sm text-muted-foreground">
                        Allow members to invite other people to the workspace
                      </p>
                    </div>
                    <Switch
                      defaultChecked={permissions?.canInviteMembers}
                      disabled={!isOwner}
                      onClick={() =>
                        handleChangePermission({
                          canInviteMembers: !permissions?.canInviteMembers,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Modify Settings</p>
                      <p className="text-sm text-muted-foreground">
                        Allow members to change workspace settings and
                        configuration
                      </p>
                    </div>
                    <Switch
                      defaultChecked={permissions?.canModifySettings}
                      disabled={!isOwner}
                      onClick={() =>
                        handleChangePermission({
                          canModifySettings: !permissions?.canModifySettings,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">Delete Resources</p>
                      <p className="text-sm text-muted-foreground">
                        Allow members to delete projects and other workspace
                        resources
                      </p>
                    </div>
                    <Switch
                      defaultChecked={permissions?.canDeleteResources}
                      disabled={!isOwner}
                      onClick={() =>
                        handleChangePermission({
                          canDeleteResources: !permissions?.canDeleteResources,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Workspace
                    owners always have full permissions regardless of these
                    settings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="danger">
            <Card className="border-destructive/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-destructive">
                    Danger Zone
                  </CardTitle>
                </div>
                <CardDescription>
                  Irreversible actions that will permanently affect your
                  workspace
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
                  <h3 className="font-semibold">Delete Workspace</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Once you delete a workspace, there is no going back. This
                    will permanently delete:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• All projects and their data</li>
                    <li>• All member associations</li>
                    <li>• All workspace settings and configuration</li>
                  </ul>
                  <Button
                    variant="destructive"
                    className="mt-6 gap-2"
                    disabled={!isOwner}
                    onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                    Delete This Workspace
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <InviteMemberSheet
        workspaceId={selectedWorkspace.id!}
        open={inviteOpen}
        slug={selectedWorkspace.slug!}
        onOpenChange={setInviteOpen}
        currentPath="WORKSPACE"
        onInvite={handleInvite}
        disabled={!hasWorkspacePermission("canInviteMembers")}
      />
      <CreateProjectDialog
        open={openCreateProjectDialog}
        onOpenChange={setOpenCreateProjectDialog}
        workspaceId={selectedWorkspace.id}
      />
    </div>
  );
}
