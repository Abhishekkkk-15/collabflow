"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api/api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateWorkspace } from "@/lib/redux/slices/workspace";
import { UserWorkspaceRoles } from "@/lib/redux/slices/userSlice";

import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceProjects from "./WorkspaceProjects";
import WorkspaceInfoCard from "./WorkspaceInfoCard";
import EditWorkspaceDialog from "./EditWorkspaceDialog";
import TransferOwnerDialog from "./TransferOwnerDialog";
import InviteMemberSheet from "../InviteMemberSheet";

import { Project, User, Workspace, WorkspaceMember } from "@prisma/client";

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
  const dispatch = useAppDispatch();

  const { workspaceRoles }: { workspaceRoles: UserWorkspaceRoles[] } =
    useAppSelector((s: any) => s.user.userRoles);

  const role = workspaceRoles?.find(
    (ws) => ws.workspaceId === workspace.id
  )?.role;

  const isRestricted = !["ADMIN", "OWNER", "MAINTAINER"].includes(
    role as string
  );

  const [members, setMembers] = useState<any[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [transferring, setTransferring] = useState(false);

  async function fetchWorkspaceMembers() {
    try {
      const res = await api.get(`/workspace/${workspace.id}/members`, {
        withCredentials: true,
      });
      setMembers(res.data || []);
    } catch (err) {
      setMembers([]);
    }
  }

  useEffect(() => {
    if (!workspace?.id) return;
    fetchWorkspaceMembers();
  }, [workspace.id]);

  async function handleSaveWorkspace(data: {
    name: string;
    slug: string;
    description?: string;
  }) {
    setSaving(true);
    try {
      const payload = {
        id: workspace.id,
        name: data.name.trim(),
        slug: data.slug.trim(),
        description: data.description?.trim() || "",
      };

      // optimistic update
      dispatch(updateWorkspace({ id: workspace.id, data: payload }));

      const res = await api.patch(`/workspace/${workspace.id}`, payload, {
        withCredentials: true,
      });

      dispatch(updateWorkspace({ id: workspace.id, data: res.data }));
      toast.success("Workspace updated");
      setEditOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update workspace");
      // reload members / state if needed
      fetchWorkspaceMembers();
    } finally {
      setSaving(false);
    }
  }

  async function handleTransferOwner(newOwnerId: string) {
    setTransferring(true);
    try {
      const res = await api.post(
        `/workspace/${workspace.id}/transfer`,
        { newOwnerId },
        { withCredentials: true }
      );
      dispatch(updateWorkspace({ id: workspace.id, data: res.data }));
      toast.success("Ownership transferred");
      setTransferOpen(false);
      fetchWorkspaceMembers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to transfer ownership");
    } finally {
      setTransferring(false);
    }
  }

  if (!workspace) {
    return (
      <div className="p-6 bg-card border rounded-md min-h-[220px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No workspace selected</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: header + projects */}
      <div className="lg:col-span-2 space-y-6">
        <WorkspaceHeader
          workspace={workspace}
          memberCount={workspace._count.members}
          isRestricted={isRestricted}
          onOpenEdit={() => setEditOpen(true)}
          onOpenInvite={() => setInviteOpen(true)}
          onOpenTransfer={() => setTransferOpen(true)}
        />

        <WorkspaceProjects
          workspace={workspace.projects}
          isRestricted={isRestricted}
        />
      </div>

      {/* Right: info + members + quick links */}
      <WorkspaceInfoCard
        workspace={workspace}
        members={workspace.members}
        isRestricted={isRestricted}
        onInviteClick={() => setInviteOpen(true)}
      />

      {/* Edit workspace dialog */}
      <EditWorkspaceDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        workspace={workspace}
        onSave={handleSaveWorkspace}
        loading={saving}
        disabled={isRestricted}
      />

      {/* Invite sheet (your old component) */}
      <InviteMemberSheet
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        workspaceId={workspace.id}
        onInvite={async (members) => {
          await api.post(
            `/workspace/${workspace.id}/invite`,
            { members },
            { withCredentials: true }
          );
          toast.success("Invitations sent");
          fetchWorkspaceMembers();
        }}
        disabled={isRestricted}
        currentPath="WORKSPACE"
      />

      {/* Transfer ownership dialog */}
      <TransferOwnerDialog
        open={transferOpen}
        onOpenChange={setTransferOpen}
        workspace={workspace}
        members={workspace.members}
        onTransfer={handleTransferOwner}
        loading={transferring}
        disabled={isRestricted}
      />
    </div>
  );
}
