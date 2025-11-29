"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Input } from "../ui/input";

import { WorkspaceRole, User } from "@prisma/client";
import { api } from "@/lib/api/api";

type InviteEntry = {
  userId: string;
  role: WorkspaceRole;
};

type InviteMemberSheetProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onInvite?: (members: InviteEntry[]) => Promise<void> | void;
  disabled?: boolean;
  workspaceId: string;
  currentPath: "PROJECT" | "WORKSPACE";
};

export default function InviteMemberSheet({
  open,
  onOpenChange,
  onInvite,
  disabled = false,
  workspaceId,
  currentPath,
}: InviteMemberSheetProps) {
  const [inviteSelected, setInviteSelected] = useState<InviteEntry[]>([]);
  const [nonMembers, setNonMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  // ----------------------------
  // Fetch non-members on OPEN
  // ----------------------------
  async function fetchNonMembers() {
    try {
      const res = await api.get(
        `user/workspaces/${workspaceId}/users?limit=20&page=1`
      );

      if (Array.isArray(res.data)) {
        setNonMembers(res.data);
      } else {
        setNonMembers([]);
      }
    } catch (e) {
      console.error("Failed fetching non-members", e);
    }
  }

  async function fetchNonMembersP() {
    try {
      const res = await api.get(
        `user/project/${workspaceId}/users?limit=20&page=1`
      );

      console.log(res);

      if (Array.isArray(res.data)) {
        setNonMembers(res.data);
      } else {
        setNonMembers([]);
      }
    } catch (e) {
      console.error("Failed fetching non-members", e);
    }
  }

  useEffect(() => {
    if (open) {
      setInviteSelected([]);
      setQuery("");
    }
  }, [open]);
  useEffect(() => {
    if (currentPath == "WORKSPACE") {
      fetchNonMembers();
    }
    if (currentPath == "PROJECT") {
      fetchNonMembersP();
    }
  }, []);
  // ----------------------------
  // Search filter
  // ----------------------------
  const filtered = nonMembers.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  });

  // ----------------------------
  // Toggle user selection
  // ----------------------------
  function toggleSelectUser(userId: string) {
    const exists = inviteSelected.find((x) => x.userId === userId);

    if (exists) {
      setInviteSelected((prev) => prev.filter((p) => p.userId !== userId));
    } else {
      setInviteSelected((prev) => [...prev, { userId, role: "CONTRIBUTOR" }]);
    }
  }

  function setUserRole(userId: string, role: WorkspaceRole) {
    setInviteSelected((prev) =>
      prev.map((p) => (p.userId === userId ? { ...p, role } : p))
    );
  }

  // ----------------------------
  // Submit
  // ----------------------------
  async function handleInvite() {
    if (!inviteSelected.length) return;

    try {
      setLoading(true);
      await onInvite?.(inviteSelected);
      onOpenChange(false);
    } catch (e) {
      console.error("Invite error", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm" disabled={disabled}>
          <UserPlus size={14} /> Invite
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[520px]">
        <SheetHeader>
          <SheetTitle>Invite members</SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-4">
          {/* SEARCH */}
          <Input
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="text-sm text-muted-foreground">
            Select users to invite and assign roles.
          </div>

          {/* USERS LIST */}
          <div className="max-h-[48vh] overflow-auto border rounded p-2 space-y-2">
            {filtered.map((m) => {
              const selected = inviteSelected.some((s) => s.userId === m.id);
              const role = inviteSelected.find((s) => s.userId === m.id)?.role;

              return (
                <div
                  key={m.id}
                  className={`
                    flex items-center gap-3 p-2 rounded cursor-pointer
                    ${selected ? "bg-muted" : "hover:bg-muted/40"}
                  `}
                  onClick={() => toggleSelectUser(m.id)}>
                  <Avatar className="h-8 w-8">
                    {m.image ? (
                      <AvatarImage src={m.image} />
                    ) : (
                      <AvatarFallback>{m.name?.[0]}</AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{m.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {m.email}
                    </div>
                  </div>

                  {/* ROLE SELECT (active only when selected) */}
                  <div
                    onClick={(e) => e.stopPropagation()} // prevent row toggle
                  >
                    <Select
                      disabled={!selected}
                      value={role}
                      onValueChange={(value) =>
                        setUserRole(m.id, value as WorkspaceRole)
                      }>
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CONTRIBUTOR">Contributor</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="VIEWER">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}>
              Cancel
            </Button>

            <Button
              onClick={handleInvite}
              disabled={loading || inviteSelected.length === 0}>
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Invite ({inviteSelected.length})
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
