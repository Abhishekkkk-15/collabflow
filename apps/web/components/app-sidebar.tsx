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
  async function fetchUserWorkspaces() {
    return axios.get("http://localhost:3001/workspace", {
      withCredentials: true,
    });
  }
  React.useEffect(() => {
    fetchUserWorkspaces().then((d) => console.log(d.data));

    return () => {};
  }, []);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {/* <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
          user={user}
        /> */}
        <UserProfileCard user={user} />
        <SearchForm />
      </SidebarHeader>
      <h4 className="px-4 py-2 text-xs font-semibold text-muted-foreground tracking-wide">
        Workspace's
      </h4>
      <SidebarSeparator className="mx-auto w-3/4" />
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm">
                <CollapsibleTrigger>
                  {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent className="pl-4">
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
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
      <SidebarRail />
    </Sidebar>
  );
}
