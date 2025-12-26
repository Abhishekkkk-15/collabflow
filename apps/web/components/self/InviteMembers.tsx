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
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Check, UserPlus } from "lucide-react";
import type { ProjectRole, User } from "@collabflow/types";
import { WorkspaceRole } from "@prisma/client";
import { api } from "@/lib/api/api";
import { Spinner } from "../ui/spinner";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

type Selected = Record<
  string,
  { user: User; role: WorkspaceRole | ProjectRole }
>;

const LIMIT = 10;

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
  const [selected, setSelected] = useState<Selected>(() => {
    const map: Selected = {};
    initialSelected.forEach(
      (u) => (map[u.id] = { user: u, role: "CONTRIBUTOR" })
    );
    return map;
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(t);
  }, [query]);
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["users", debouncedQuery],
      queryFn: async ({ pageParam }) => {
        let res;
        if (roleType == "WORKSPACE") {
          res = await api.get(
            `/user?limit=${LIMIT}&cursor=${pageParam ?? ""}&q=${debouncedQuery}`
          );
          return res.data;
        }
        res = await api.get(
          `workspace/${slug}/members?limit=${LIMIT}&cursor=${
            pageParam ?? ""
          }&q=${debouncedQuery}`
        );
        console.log("res", res.data);
        return res.data;
      },
      initialPageParam: null,
      getNextPageParam: (lastPage) => {
        return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
      },
    });
  const users: User[] = data?.pages.flatMap((page) => page.members) ?? [];

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

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
  // function setUserRole(user: User, role: WorkspaceRole) {
  //   (prev) =>
  //     prev.map((p) =>
  //       p.userId === user.id ? { ...p, role, email: user.email! } : p
  //     );
  // }
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
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search or enter email..."
                value={query}
                onValueChange={setQuery}
              />
              <CommandList>
                <CommandGroup>
                  <ScrollArea className="h-auto ">
                    {users?.map((u) => {
                      const selectedd = Object.values(selected).find(
                        (u) => u.user.id == u.user.id
                      );
                      const role = Object.values(selected).find(
                        (u) => u.user.id == u.user.id
                      )?.role;

                      // )?.role;
                      selected[""];
                      return (
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
                      );
                    })}
                    {hasNextPage && <div ref={loadMoreRef} className="h-4" />}

                    {(isFetching || isFetchingNextPage) && (
                      <div className="flex  items-center justify-center m-5">
                        <Spinner aria-label="Loading" width={20} height={20} />
                      </div>
                    )}

                    {users?.length === 0 && (
                      <div className="p-3 text-sm text-muted-foreground">
                        No users found
                      </div>
                    )}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          <div className="border-t pt-3">
            <div className="text-xs font-medium mb-2">People with access</div>

            <ScrollArea className="h-full">
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
