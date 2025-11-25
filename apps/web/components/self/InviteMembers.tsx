"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Check, MoreHorizontal, UserPlus } from "lucide-react";
import type {
  ProjectRole,
  User,
  UserRole,
  WorkspaceRole,
  PROJECT_ROLE_VALUES,
} from "@collabflow/types";
import axios from "axios";

type Selected = Record<
  string,
  { user: User; role: WorkspaceRole | ProjectRole }
>;

export function InviteMembers({
  onChange,
  initialSelected = [],
  roleType = "WORKSPACE",
}: {
  initialSelected?: User[];
  onChange?: (
    members: { userId: string; role: WorkspaceRole | ProjectRole }[]
  ) => void;
  roleType: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>();
  const [selected, setSelected] = useState<Selected>(() => {
    const map: Selected = {};
    initialSelected.forEach((u) => (map[u.id] = { user: u, role: "MEMBER" }));
    return map;
  });
  async function fetchUsers() {
    return await axios.get("http://localhost:3001/user", {
      withCredentials: true,
    });
  }
  useEffect(() => {
    (async () => {
      let res = await fetchUsers();
      setAllUsers(() => res.data);
    })();
  }, []);

  const users = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allUsers;
    return allUsers?.filter(
      (u) =>
        u.name!.toLowerCase().includes(q) || u.email!.toLowerCase().includes(q)
    );
  }, [allUsers, query]);

  const toggleSelect = (user: User) => {
    setSelected((prev) => {
      const copy = { ...prev };

      if (copy[user.id]) delete copy[user.id];
      else copy[user.id] = { user, role: "MEMBER" };

      const members = Object.values(copy).map((s) => ({
        userId: s.user.id,
        role: s.role,
      }));

      onChange?.(members);

      return copy;
    });
  };
  const WORKSPACE_ROLES = [
    { value: "OWNER", label: "Owner" },
    { value: "ADMIN", label: "Admin" },
    { value: "MEMBER", label: "Member" },
    { value: "GUEST", label: "Guest" },
  ] as const;

  const PROJECT_ROLES = [
    { value: "OWNER", label: "Owner" },
    { value: "MAINTAINER", label: "Maintainer" },
    { value: "CONTRIBUTOR", label: "Contributor" },
    { value: "VIEWER", label: "Viewer" },
  ] as const;
  // map value → label
  function getRoleLabel(role: string) {
    return (
      WORKSPACE_ROLES.find((r) => r.value === role)?.label ??
      PROJECT_ROLES.find((r) => r.value === role)?.label ??
      "Unknown"
    );
  }

  const setRole = (id: string, role: WorkspaceRole | ProjectRole) => {
    setSelected((prev) => {
      const next = { ...prev, [id]: { ...prev[id], role } };

      const members = Object.values(next).map((s) => ({
        userId: s.user.id,
        role: s.role,
      }));

      onChange?.(members);

      return next;
    });
  };

  const isSelected = (id: string) => !!selected[id];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserPlus size={16} /> Invite members
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" sideOffset={8} className="w-[420px] p-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold">Share this workspace</h3>
              <p className="text-xs text-muted-foreground">
                Invite people and assign permissions.
              </p>
            </div>
            <div>
              <Button size="sm" variant="ghost" onClick={() => setSelected({})}>
                Clear
              </Button>
            </div>
          </div>

          <div className="mb-2">
            <Command>
              <CommandInput
                placeholder="Search or enter email..."
                value={query}
                onValueChange={setQuery}
              />
              <CommandGroup>
                <ScrollArea className="max-h-52">
                  {users?.map((u) => (
                    <CommandItem
                      key={u.id}
                      onSelect={() => toggleSelect(u)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {u.image ? (
                            <AvatarImage src={u.image} />
                          ) : (
                            <AvatarFallback>
                              {u.name!.split(" ")[0][0]}
                            </AvatarFallback>
                          )}
                        </Avatar>

                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {u.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {u.email}
                          </div>
                        </div>
                      </div>

                      <div className="ml-auto">
                        {isSelected(u.id) ? (
                          <Check className="h-4 w-4" />
                        ) : null}
                      </div>
                    </CommandItem>
                  ))}

                  {users?.length === 0 && (
                    <div className="p-3 text-sm text-muted-foreground">
                      No users found
                    </div>
                  )}
                </ScrollArea>
              </CommandGroup>
            </Command>
          </div>

          <div className="border-t pt-3">
            <div className="text-xs font-medium mb-2">People with access</div>

            <ScrollArea className="max-h-40">
              <div className="flex flex-col gap-2">
                {Object.values(selected).length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No people selected
                  </div>
                )}

                {Object.values(selected).map(({ user, role }) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/20">
                    <Avatar className="h-8 w-8">
                      {user.image ? (
                        <AvatarImage src={user.image} />
                      ) : (
                        <AvatarFallback>
                          {user.name!.split(" ")[0][0]}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {user.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </div>
                    </div>

                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            {getRoleLabel(role)}
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          {(roleType === "WORKSPACE"
                            ? WORKSPACE_ROLES
                            : PROJECT_ROLES
                          ).map((r) => (
                            <DropdownMenuItem
                              key={r.value}
                              onClick={(e) => {
                                e.preventDefault(); // keep dropdown smooth
                                setRole(user.id, r.value);
                              }}>
                              {r.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex items-center justify-end gap-2 mt-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  /* you can pass selected back to parent here */ setOpen(
                    false
                  );
                }}>
                Send invites
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
