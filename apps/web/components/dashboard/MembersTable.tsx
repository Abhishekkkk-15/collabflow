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
import { WorkspaceMember, User } from "@prisma/client";
import { api } from "@/lib/api/api";
import { toast } from "sonner";
import axios from "axios";

/**
 * Roles:
 * "OWNER" | "MAINTAINER" | "CONTRIBUTOR" | "VIEWER"
 */
type Role = "OWNER" | "MAINTAINER" | "CONTRIBUTOR" | "VIEWER";

type MemberWithUser = WorkspaceMember & {
  user: User;
};

export default function MembersTable({
  workspaceSlug,
}: {
  workspaceSlug: string;
}) {
  const [members, setMembers] =
    useState<MemberWithUser[]>([]);

    const fetchMembers = async() =>{
        return (await api.get(`workspace/${workspaceSlug}/members`)).data
    }

  const [query, setQuery] = useState("");

  const roles: Role[] = [
    "OWNER",
    "MAINTAINER",
    "CONTRIBUTOR",
    "VIEWER",
  ];

  const roleStyles: Record<Role, string> = {
    OWNER: "bg-purple-100 text-purple-700",
    MAINTAINER: "bg-blue-100 text-blue-700",
    CONTRIBUTOR: "bg-green-100 text-green-700",
    VIEWER: "bg-gray-100 text-gray-700",
  };

  const filteredMembers = members.filter((m) =>
    `${m.user.name ?? ""} ${m.user.email}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  async function handleRoleChange(
    memberId: string,
    role: Role
  ) {
    try {
      await api.patch(`/workspace/${workspaceSlug}/members/${memberId}`, {
        role,
      });

      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId ? { ...m, role } : m
        )
      );

      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    }
  }

  async function handleRemove(memberId: string) {
    try {
      await api.delete(
        `/${workspaceSlug}/members/${memberId}`
      );

      setMembers((prev) =>
        prev.filter((m) => m.id !== memberId)
      );

      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    }
  }

  useEffect(() => {
    (async()=>{
        
        
        let members = await fetchMembers()
    
        setMembers(members.members)
    })() 
    return () => {
        
    };
  }, [workspaceSlug]);

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
              <th className="p-3 w-[50px]"></th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((member) => (
              <tr
                key={member.id}
                className="border-t hover:bg-muted/20"
              >
                <td className="p-3">
                  <Checkbox />
                </td>

                {/* USER */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={member.user.image ?? ""}
                      />
                      <AvatarFallback>
                        {member.user.name?.[0] ?? "U"}
                      </AvatarFallback>
                    </Avatar>

                    <span className="font-medium">
                      {member.user.name ?? "Unnamed"}
                    </span>
                  </div>
                </td>

                {/* EMAIL */}
                <td className="p-3 text-muted-foreground">
                  {member.user.email}
                </td>

                {/* ROLE */}
                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={roleStyles[member.role as Role]}
                      >
                        {member.role}
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-40">
                      {roles.map((role) => (
                        <div
                          key={role}
                          className="px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                          onClick={() =>
                            handleRoleChange(member.id, role)
                          }
                        >
                          {role}
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>

                {/* ACTIONS */}
                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <div
                        className="px-2 py-1 text-sm text-red-600 hover:bg-muted rounded cursor-pointer"
                        onClick={() => handleRemove(member.id)}
                      >
                        Remove
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}

            {filteredMembers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-muted-foreground"
                >
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
