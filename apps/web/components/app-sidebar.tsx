"use client";
import * as React from "react";
import { ChevronRight } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import UserProfileCard from "./self/UserProfileCard";
import axios from "axios";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import Link from "next/link";

// CollabFlow Sidebar Dummy Data
const data = {
  versions: ["v0.1.0", "v0.2.0-alpha", "v1.0.0"],
  navMain: [
    {
      title: "Fun E-commerce Team",
      url: "#",
      items: [
        {
          title: "Frontend Redesign",
          url: "dashboard/Fun E-commerce Team/frontend/tasks",
          isActive: true,
        },
        {
          title: "Backend API",
          url: "dashboard/Fun-E-commerce-Team/backend/tasks",
        },
        {
          title: "UI Overhaul",
          url: "dashboard/Fun-E-commerce-Team/ui-overhaul/tasks",
        },
      ],
    },
    {
      title: "Blogging App Team",
      url: "#",
      items: [
        {
          title: "Dashboard Rewrite",
          url: "dashboard/Dashboard-Rewrite/dashboard/tasks",
        },
      ],
    },
    {
      title: "College Final Year",
      url: "#",
      items: [
        {
          title: "DB Schema",
          url: "dashboard/College-Final-Year/db-schema/tasks",
        },
      ],
    },
    {
      title: "Personal Notes",
      url: "#",
      items: [
        {
          title: "Ideas",
          url: "dashboard/Personal-Notes/ideas/tasks",
        },
        {
          title: "Planning",
          url: "dashboard/Personal-Notes/planning/tasks",
        },
      ],
    },
  ],
};

type IProps = React.ComponentProps<typeof Sidebar> & {
  user: any; // add user here
};
export function AppSidebar({ user, ...props }: IProps) {
  // const user =  await auth()
  const [workSpaces, setWorkSpaces] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  async function fetchUserWorkspaces() {
    try {
      const res = await api.get("/workspace");
      setWorkSpaces(res.data);
      console.log(res.data);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch workspaces.",
        {
          position: "top-center",
          richColors: true,
        }
      );
    } finally {
      setLoading(false);
    }
  }
  React.useEffect(() => {
    fetchUserWorkspaces();
  }, []);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <UserProfileCard user={user} />
        <SearchForm />
      </SidebarHeader>
      <h4 className="px-4 py-2 text-xs font-semibold text-muted-foreground tracking-wide">
        Workspace's
      </h4>
      <SidebarSeparator className="mx-auto w-3/4" />
      {loading ? (
        <div className="h-full w-full flex justify-center items-center">
          <Spinner className="size-6" />
        </div>
      ) : (
        <SidebarContent className="gap-0">
          {/* We create a collapsible SidebarGroup for each parent. */}
          {workSpaces?.map((workspace) => (
            <Collapsible
              key={workspace.id}
              title={workspace.name}
              className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm">
                  <CollapsibleTrigger>
                    {workspace.name}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent className="pl-4">
                    <SidebarMenu>
                      {workspace?.projects?.map((item: any) => (
                        <SidebarMenuItem key={item?.name}>
                          <SidebarMenuButton asChild isActive={item?.isActive}>
                            <Link
                              href={`/dashboard/${workspace.slug}/${item.slug}/tasks`}>
                              <span>{item?.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))}
        </SidebarContent>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
