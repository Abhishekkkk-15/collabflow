"use client";

import { ChevronRight, MoreHorizontalIcon, AppWindow } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useEffect } from "react";

import {
  TProject,
  TWorkspace,
  setWorkspaces,
} from "@/lib/redux/slices/workspace";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavMain({ items }: { items: TWorkspace[] }) {
  if (items.length === 0)
    return (
      <div className="flex flex-col gap-1 pl-4 pr-2">
        <Skeleton className="h-7 w-full rounded-md" />
        <Skeleton className="h-7 w-full rounded-md" />
        <Skeleton className="h-7 w-full rounded-md" />
        <Skeleton className="h-7 w-full rounded-md" />
      </div>
    );

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setWorkspaces(items));
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>

      <SidebarMenu>
        {items?.map((item: TWorkspace) => (
          <Collapsible key={item?.id} asChild>
            <SidebarMenuItem>
              {/* Workspace Button */}
              <SidebarMenuButton asChild tooltip={item?.name}>
                <Link href={`/dashboard/${item?.slug}`}>
                  <AppWindow />
                  <span>
                    {item?.name.length >= 20
                      ? `${item?.name.slice(0, 20)}...`
                      : item?.name}
                  </span>
                </Link>
              </SidebarMenuButton>

              {/* Workspace Projects */}
              {item?.projects.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                    </SidebarMenuAction>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item?.projects?.map((subItem: TProject) => (
                        <SidebarMenuSubItem
                          key={subItem?.id}
                          className="group flex items-center justify-between">
                          {/* Project Name */}
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={`/dashboard/${item?.slug}/${subItem?.slug}`}>
                              <span>{subItem?.name}</span>
                            </Link>
                          </SidebarMenuSubButton>

                          {/* Hover three dots */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="px-1 py-1 hover:bg-accent rounded">
                                  <MoreHorizontalIcon className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end" side="right">
                                {/* Chat */}
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/dashboard/${item?.slug}/${subItem?.slug}/chat`}>
                                    Chat
                                  </Link>
                                </DropdownMenuItem>

                                {/* Tasks */}
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/dashboard/${item?.slug}/${subItem?.slug}/tasks`}>
                                    Tasks
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
