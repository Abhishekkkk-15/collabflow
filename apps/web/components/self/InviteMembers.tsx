"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import type { ProjectRole, User, WorkspaceMember } from "@collabflow/types";
import axios, { Axios, AxiosResponse } from "axios";
import { WorkspaceRole } from "@prisma/client";
import { email } from "zod";
import { api } from "@/lib/api/api";
import { Spinner } from "../ui/spinner";

type Selected = Record<
  string,
  { user: User; role: WorkspaceRole | ProjectRole }
>;

export function InviteMembers({
  onChange,
  initialSelected = [],
  roleType = "WORKSPACE",
  slug,
}: {
  initialSelected?: User[];
  onChange?: (
    members: {
      userId: string;
      role: WorkspaceRole | ProjectRole;
      email: string;
    }[]
  ) => void;
  roleType: "WORKSPACE" | "PROJECT";
  slug: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<Selected>(() => {
    const map: Selected = {};
    initialSelected.forEach(
      (u) => (map[u.id] = { user: u, role: "CONTRIBUTOR" })
    );
    return map;
  });
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const cursorRef = useRef<string | null>(null);
  const queryRef = useRef("");

  useEffect(() => {
    cursorRef.current = cursor;
    queryRef.current = query;
  }, [cursor, query]);
  async function fetchUsers(
    q?: string,
    nextCursor?: string | null,
    isFirstPage = false
  ) {
    if (!isFirstPage && (!hasMore || loading)) return;
    setLoading(true);
    let res: AxiosResponse;
    const LIMIT = 3;

    if (roleType == "WORKSPACE") {
      res = await api.get(
        `/user?limit=${LIMIT}&cursor=${nextCursor ?? ""}&q=${q}`
      );
      console.log(res.config.url);
      console.log("cursor : ", res.data);
      setAllUsers((prev) => [...prev!, ...res.data.members]);
      setHasMore(res.data.hasNextPage);
      setCursor(res.data?.nextCursor);
      setLoading(false);
      return res.data.members;
    }
    res = await api.get(`workspace/${slug}/members`);
    setAllUsers((prev) => [...prev!, ...res.data.members]);
    return res;
  }

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchUsers(queryRef.current, cursorRef.current, false);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [fetchUsers]);

  function debounce<T extends (...args: any[]) => void>(delay: number, fn: T) {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }
  function setter(e: string) {
    setQuery(e);
  }
  const debouncedSearch = useMemo(() => debounce(1000, fetchUsers), []);

  useEffect(() => {
    setAllUsers([]);
    setCursor(null);

    console.log("from bounce");
    debouncedSearch(queryRef.current, cursorRef.current!, true);
  }, [query]);

  const toggleSelect = (user: User) => {
    setSelected((prev) => {
      const copy = { ...prev };

      if (copy[user.id]) delete copy[user.id];
      else copy[user.id] = { user, role: "CONTRIBUTOR" };

      const members = Object.values(copy).map((s) => ({
        userId: s.user.id,
        role: s.role,
        email: s.user.email!,
      }));
      onChange?.(members);

      return copy;
    });
  };
  const WORKSPACE_ROLES = [
    { value: "MAINTAINER", label: "Maintainer" },
    { value: "CONTRIBUTOR", label: "Contributor" },
    { value: "VIEWER", label: "Viewer" },
  ] as const;

  const PROJECT_ROLES = [
    { value: "MAINTAINER", label: "Maintainer" },
    { value: "CONTRIBUTOR", label: "Contributor" },
    { value: "VIEWER", label: "Viewer" },
  ] as const;
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
        email: s.user.email!,
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
          <UserPlus size={16} />{" "}
          {roleType == "WORKSPACE" ? "Invite Members" : "Add Members"}
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
                onValueChange={setter}
              />
              <CommandGroup>
                <ScrollArea className="max-h-52 h-40">
                  {allUsers?.map((u) => (
                    <CommandItem
                      key={u.id}
                      onSelect={() => toggleSelect(u)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {u.image ? (
                            <AvatarImage src={u.image} />
                          ) : (
                            <AvatarFallback>{u.name!}</AvatarFallback>
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
                        {isSelected(u.id!) ? (
                          <Check className="h-4 w-4" />
                        ) : null}
                      </div>
                    </CommandItem>
                  ))}
                  {hasMore && <div ref={ref} className="h-10" />}

                  {loading && (
                    <div className="flex  items-center justify-center m-5">
                      <Spinner aria-label="Loading" width={20} height={20} />
                    </div>
                  )}

                  {allUsers?.length === 0 && (
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
                                e.preventDefault();
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
                  setOpen(false);
                }}>
                {roleType == "WORKSPACE" ? "Invite Members" : "Add Members"}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
