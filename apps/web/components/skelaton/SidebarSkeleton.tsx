"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { NavUser } from "../nav-user";

export function SidebarSkeleton({ user }: any) {
  return (
    <Sidebar variant="inset">
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" disabled>
              {/* App Icon */}
              <Skeleton className="h-8 w-8 rounded-lg" />

              <div className="flex flex-col flex-1 gap-1 overflow-hidden">
                <Skeleton className="h-3 w-24" /> {/* Workspace name */}
                <Skeleton className="h-3 w-16" /> {/* Plan */}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="flex flex-col gap-6">
        {/* Workspaces skeleton list */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24 ml-4" /> {/* Section label */}
          <div className="flex flex-col gap-1 pl-4 pr-2">
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        </div>

        {/* Projects Skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20 ml-4" /> {/* Section label */}
          <div className="flex flex-col gap-1 pl-4 pr-2">
            <Skeleton className="h-7 w-full rounded-md" />
            <Skeleton className="h-7 w-full rounded-md" />
            <Skeleton className="h-7 w-full rounded-md" />
            <Skeleton className="h-7 w-full rounded-md" />
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="flex flex-col gap-2 mt-auto">
          <Skeleton className="h-3 w-16 ml-4" />
          <div className="flex flex-col gap-1 pl-4 pr-2">
            <Skeleton className="h-7 w-full rounded-md" />
            <Skeleton className="h-7 w-full rounded-md" />
          </div>
        </div>
      </SidebarContent>

      {/* FOOTER (User Section) */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" disabled>
              {/* Avatar Skeleton */}
              <Skeleton className="h-8 w-8 rounded-lg" />

              <NavUser user={user} />

              {/* Dropdown Icon */}
              <Skeleton className="h-4 w-4 rounded" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
