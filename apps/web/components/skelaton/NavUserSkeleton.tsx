"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function NavUserSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="flex items-center gap-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          {/* Avatar skeleton */}
          <Skeleton className="h-8 w-8 rounded-lg" />

          {/* Text skeletons */}
          <div className="flex flex-col flex-1 gap-1 overflow-hidden">
            <Skeleton className="h-3 w-24" /> {/* Name */}
            <Skeleton className="h-3 w-32" /> {/* Email */}
          </div>

          {/* Chevron icon skeleton */}
          <Skeleton className="h-4 w-4 rounded" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
