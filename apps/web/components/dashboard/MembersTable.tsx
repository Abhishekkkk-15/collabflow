"use client";

import React, { useEffect, useState } from "react";
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
import { User, WorkspaceRole } from "@prisma/client";
import { api } from "@/lib/api/api";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const LIMIT = 2;

export default function MembersTable({
  workspaceSlug,
  onRoleChange,
  onRemove,
}: {
  workspaceSlug: string;
  onRoleChange: (id: string, role: WorkspaceRole) => void;
  onRemove: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // reset page when searching
  useEffect(() => {
    setPage(1);
  }, [query]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["members", workspaceSlug, page, query],
    queryFn: async () => {
      const res = await api.get(`workspace/${workspaceSlug}/members`, {
        params: {
          limit: LIMIT,
          page,
          q: query,
        },
      });
      return res.data;
    },
  });
  console.log("d", data);
  const members: User[] = data?.members ?? [];
  const totalPages = data?.totalPage || false;

  const roles: WorkspaceRole[] = ["MAINTAINER", "CONTRIBUTOR", "VIEWER"];

  const roleStyles: Record<WorkspaceRole, string> = {
    OWNER: "bg-purple-100 text-purple-700",
    MAINTAINER: "bg-blue-100 text-blue-700",
    CONTRIBUTOR: "bg-green-100 text-green-700",
    VIEWER: "bg-gray-100 text-gray-700",
  };

  async function handleRoleChange(id: string, role: WorkspaceRole) {
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

  return (
    <div>
      {/* ---------------- TOP BAR ---------------- */}
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

      {/* ---------------- TABLE ---------------- */}
      <div className="border rounded-md overflow-hidden">
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
                    <DropdownMenuTrigger
                      asChild
                      disabled={member.role === "OWNER"}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={roleStyles[member.role as WorkspaceRole]}>
                        {member.role}
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-40">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      disabled={member.role === "OWNER"}>
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
                </td>
              </tr>
            ))}

            {members.length === 0 && !isLoading && (
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

      {/* ---------------- PAGINATION ---------------- */}
      <div className="flex justify-between items-center p-4">
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages / LIMIT}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>

      {isFetching && (
        <div className="text-center text-xs text-muted-foreground pb-4">
          Updating…
        </div>
      )}
    </div>
  );
}
