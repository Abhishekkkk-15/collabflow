"use client";

import React, { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Settings } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, WorkspacePermission, WorkspaceRole } from "@prisma/client";
import { api } from "@/lib/api/api";
import { toast } from "sonner";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";

const LIMIT = 10;

export default function MembersTable({
  workspaceSlug,
  onRoleChange,
  onRemove,
  permissions,
  isOwner = false,
}: {
  workspaceSlug: string;
  onRoleChange: (id: string, role: WorkspaceRole) => void;
  onRemove: (id: string) => void;
  permissions: WorkspacePermission;
  isOwner: boolean;
}) {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLTableRowElement | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  // const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(t);
  }, [query]);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["members", workspaceSlug, debouncedQuery],
      queryFn: async ({ pageParam }) => {
        console.log("pageParam", pageParam);
        const res = await api.get(
          `api/proxy/workspace/${workspaceSlug}/members?limit=${LIMIT}&cursor=${
            pageParam ?? ""
          }&q=${debouncedQuery}`
        );
        return res.data;
      },
      initialPageParam: undefined,
      refetchOnMount: true,
      getNextPageParam: (lastPage) => {
        return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
      },
    });
  const members = data?.pages.flatMap((page) => page.members) ?? [];
  const scrollParentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px", root: scrollParentRef.current }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const roles: WorkspaceRole[] = ["MAINTAINER", "CONTRIBUTOR", "VIEWER"];

  const roleStyles: Record<WorkspaceRole, string> = {
    OWNER: "bg-purple-100 text-purple-700",
    MAINTAINER: "bg-blue-100 text-blue-700",
    CONTRIBUTOR: "bg-green-100 text-green-700",
    VIEWER: "bg-gray-100 text-gray-700",
  };

  async function handleRoleChange(id: string, role: WorkspaceRole) {
    if (!isOwner)
      return toast.warning("Only Workspace owner can change members role's", {
        position: "top-right",
      });
    try {
      await onRoleChange(id, role);
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    }
  }

  async function handleRemove(id: string) {
    try {
      await onRemove(id);
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    }
  }
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

  return (
    <div>
      <div className="p-4 flex justify-between items-center">
        <Input
          placeholder="Search members..."
          className="w-64"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Manage
        </Button>
      </div>

      <div
        className="border rounded-md overflow-y-auto"
        style={{ maxHeight: "420px" }}
        ref={scrollParentRef}>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground uppercase text-xs border-b">
            <tr>
              <th className="p-3 w-[40px]">
                <Checkbox />
              </th>
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 w-[50px]" />
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-t hover:bg-muted/20">
                <td className="p-3">
                  <Checkbox />
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.image ?? ""} />
                      <AvatarFallback>{member.name?.[0] ?? "U"}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {member.name ?? "Unnamed"}
                    </span>
                  </div>
                </td>

                <td className="p-3 text-muted-foreground">{member.email}</td>

                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={!isOwner}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={roleStyles[member.role as WorkspaceRole]}>
                        {member.role}
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-40"
                      aria-disabled={isOwner}>
                      {roles.map((role) => (
                        <div
                          key={role}
                          className="px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                          onClick={() => handleRoleChange(member.id, role)}>
                          {role}
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>

                <td className="p-3">
                  {member.role != "OWNER" ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        disabled={hasWorkspacePermission("canInviteMembers")}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <div
                          className="px-2 py-1 text-sm text-red-600 hover:bg-muted rounded cursor-pointer"
                          onClick={() => handleRemove(member.id)}>
                          Remove
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
            {hasNextPage && (
              <tr ref={ref}>
                <td colSpan={5} className="h-6" />
              </tr>
            )}

            {members.length === 0 && !isFetching && (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-muted-foreground">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isFetching && (
        <div className="text-center text-xs text-muted-foreground pb-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}
