"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LayoutDashboardIcon,
  LifeBuoy,
  Map,
  PieChart,
  Plus,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { TProject, TWorkspace } from "@/lib/redux/slices/workspace";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Workspace } from "@collabflow/types";
import { SidebarSkeleton } from "../skelaton/SidebarSkeleton";
import Link from "next/link";
import { Card, CardContent } from "./card";
import { Button } from "./button";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

interface IExtendedProp extends React.ComponentProps<typeof Sidebar> {
  w: { workspaces: TWorkspace[] | null } | null;
}

export function AppSidebar({ ...props }: IExtendedProp) {
  console.log("ws", props.w);
  const params = useParams();
  const activeWorkspace = params.workspace?.toString();
  const activeProject = params.project?.toString();
  const [activeWsProjects, setActiveWsProjects] = React.useState<TProject[]>(
    []
  );
  const user = useAppSelector((s: any) => s.user.user);

  function getActiveWorkspaceProjects() {
    if (!props.w || props?.w.workspaces == null) return;
    let activeWs = props?.w.workspaces.find(
      (ws: TWorkspace) => ws?.slug === activeWorkspace
    ) as TWorkspace;
    console.log(activeWs.projects);
    if (props.w) {
      setActiveWsProjects(activeWs?.projects);
    }
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/workspace">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">CollabFlow</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {props.w?.workspaces ? (
          <NavMain items={props.w.workspaces} />
        ) : (
          <div>
            <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
              <div className="text-muted-foreground text-sm">
                No workspace created yet
              </div>

              <Link href="/workspace/add">
                <Button variant="default" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Workspace
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
