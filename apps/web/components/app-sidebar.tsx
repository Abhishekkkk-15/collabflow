"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, MoreHorizontal } from "lucide-react";

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
  SidebarSeparator,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setActiveWorkspace,
  TProject,
  TWorkspace,
} from "@/lib/redux/slices/workspace";

import { Spinner } from "./ui/spinner";
import UserProfileCard from "./self/UserProfileCard";
import { SearchForm } from "@/components/search-form";
import { SessionContext } from "next-auth/react";

export function AppSidebar({ ...props }: any) {
  const params = useParams();
  const activeWorkspace = params.workspace?.toString();
  const activeProject = params.project?.toString();
  const [activeWsProjects, setActiveWsProjects] = React.useState<TProject[]>(
    []
  );
  const dispatch = useAppDispatch();
  const { workspaces, status } = useAppSelector((s: any) => s?.workspace!);

  function getActiveWorkspaceProjects() {
    let activeWs = workspaces.find(
      (ws: TWorkspace) => ws.slug === activeWorkspace
    ) as TWorkspace;
    console.log(activeWs.projects);
    setActiveWsProjects(activeWs.projects);
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <UserProfileCard />
        <SearchForm />
      </SidebarHeader>

      {/* Section Title */}
      <h4 className="px-4 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        Workspaces
      </h4>
      <SidebarSeparator className="mx-auto w-4/5 opacity-50" />

      {status === "loading" ? (
        <div className="h-full w-full flex justify-center items-center">
          <Spinner className="size-6" />
        </div>
      ) : (
        <SidebarContent className="gap-1 pt-1">
          {workspaces?.map((workspace: any) => {
            const isActiveWS = activeWorkspace === workspace.slug;

            return (
              <Collapsible
                key={workspace.id}
                defaultOpen={isActiveWS}
                className="group/collapsible"
                onClick={() => {
                  dispatch(setActiveWorkspace(activeWorkspace!));
                }}>
                <SidebarGroup>
                  {/* WORKSPACE ITEM */}
                  <SidebarGroupLabel
                    className={`
                      flex items-center px-3 py-2 rounded-md cursor-pointer transition-all
                      border-l-4
                      ${
                        isActiveWS
                          ? "bg-accent text-accent-foreground font-semibold border-primary"
                          : "hover:bg-accent/40 border-transparent"
                      }
                    `}>
                    {/* Workspace redirect */}
                    <Link
                      href={`/dashboard/${workspace.slug}`}
                      className="flex-1 truncate"
                      onClick={() => {
                        dispatch(
                          setActiveWorkspace(
                            workspace.id || useParams().workspace
                          )
                        );
                      }}>
                      {workspace.name}
                    </Link>

                    {/* Unread count */}
                    {workspace.unreadCount > 0 && (
                      <span className="ml-2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full shadow">
                        {workspace.unreadCount}
                      </span>
                    )}

                    {/* Dropdown arrow */}
                    <CollapsibleTrigger asChild>
                      <button className="p-1 ml-2 rounded hover:bg-accent transition">
                        <ChevronRight
                          className={`
                            size-4 text-muted-foreground
                            transition-transform
                            group-data-[state=open]/collapsible:rotate-90
                          `}
                        />
                      </button>
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>

                  {/* PROJECT LIST */}
                  <CollapsibleContent>
                    <SidebarGroupContent className="mt-1 space-y-1 pl-3">
                      <SidebarMenu>
                        {workspace.projects?.map((p: any) => {
                          const isActiveProject = p.slug === activeProject;

                          return (
                            <SidebarMenuItem
                              key={p.id}
                              className="flex items-center group">
                              {/* Project Link */}
                              <SidebarMenuButton
                                asChild
                                className={`
                                  flex-1 text-sm rounded-md transition-all px-2 py-1.5
                                  border-l-4
                                  ${
                                    isActiveProject
                                      ? "bg-accent border-primary font-semibold"
                                      : "hover:bg-accent/40 border-transparent"
                                  }
                                `}>
                                <Link
                                  href={`/dashboard/${workspace.slug}/${p.slug}/tasks`}>
                                  {p.name}
                                </Link>
                              </SidebarMenuButton>

                              {/* Project unread */}
                              {p.unreadCount > 0 && (
                                <span className="ml-2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full shadow">
                                  {p.unreadCount}
                                </span>
                              )}

                              {/* ... menu */}
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className="ml-2 p-1 rounded hover:bg-accent/40 transition">
                                    <MoreHorizontal className="size-4 text-muted-foreground" />
                                  </button>
                                </PopoverTrigger>

                                <PopoverContent
                                  className="w-44 p-0 overflow-hidden rounded-md border bg-popover shadow-md"
                                  align="start">
                                  <div className="py-1 text-sm">
                                    <Link
                                      href={`/dashboard/${workspace.slug}/${p.slug}/tasks`}
                                      className="block px-3 py-2 hover:bg-muted">
                                      Tasks
                                    </Link>

                                    <Link
                                      href={`/dashboard/${workspace.slug}/${p.slug}/chat`}
                                      className="block px-3 py-2 hover:bg-muted">
                                      Chat
                                    </Link>

                                    <Link
                                      href={`/dashboard/${workspace.slug}/${p.slug}/settings`}
                                      className="block px-3 py-2 hover:bg-muted">
                                      Settings
                                    </Link>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            );
          })}
        </SidebarContent>
      )}

      <SidebarRail />
    </Sidebar>
  );
}
