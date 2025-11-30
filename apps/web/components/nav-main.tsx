"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { AppWindow } from "lucide-react";

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
import { Workspace } from "@prisma/client";
import {
  setWorkspaces,
  TProject,
  TWorkspace,
} from "@/lib/redux/slices/workspace";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useEffect } from "react";

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
    console.log("its started");
  });
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items?.map((item: TWorkspace) => (
          <Collapsible key={item?.id} asChild>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item?.name}>
                <Link href={`/dashboard/${item?.slug} ` as string}>
                  <AppWindow />
                  <span>
                    {item?.name.length >= 20
                      ? `${item?.name.slice(0, 20)}...`
                      : item?.name}
                  </span>
                </Link>
              </SidebarMenuButton>
              {item?.projects.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item?.projects?.map((subItem: TProject) => (
                        <SidebarMenuSubItem key={subItem?.id}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={`/dashboard/${item?.slug}/${subItem?.slug}`}>
                              <span>{subItem?.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
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
