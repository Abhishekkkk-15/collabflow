"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, Plus, Users, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { User } from "@collabflow/types";
import { UserProfileSkelaton } from "../skelaton/UserProfileSkalaton";
export default function UserProfileCard() {
  const user: User = useSelector((state: any) => state?.user.user);

  return (
    <>
      {!user ? (
        <UserProfileSkelaton />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent transition">
              <Avatar className="h-8 w-8 rounded-4xl">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex item-center content-between justify-between gap-3"></div>

              <span className="text-sm font-medium">{user.name}</span>

              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-80 p-3 rounded-xl shadow-lg"
            align="start"
            sideOffset={10}>
            <div className="flex items-center gap-3 px-2 py-2">
              <Avatar className="h-12 w-12 rounded-4xl">
                <AvatarImage src={user.image || ""} className="rounded-xl" />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>

              <div>
                <div className="font-semibold text-[15px]">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>

            <div className="py-1">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Users className="h-4 w-4" />
                Abhishek’s Notion
              </DropdownMenuItem>
              <Link href={`/workspace`}>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  New workspace
                </DropdownMenuItem>
              </Link>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
              onClick={() => signOut({ redirectTo: "/login" })}>
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
