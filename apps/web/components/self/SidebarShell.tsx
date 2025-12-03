"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import NotificationDropdown from "./NotificationDropdown";
import { ModeToggle } from "../ModeToggle";
import { normalizeString } from "@/lib/slugToTitle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useWorkspace, useWorkspaces } from "@/lib/redux/hooks/use-workspaces";
import { TProject, TWorkspace } from "@/lib/redux/slices/workspace";
import {
  useRolesforProject,
  useRolesforWs,
  useUserRoles,
} from "@/lib/redux/hooks/use-user";
import { AUTHORIZED_ROLES, type PROJECT_ROLE_VALUES } from "@collabflow/types";
import { CreateProjectDialog } from "./CreateProjectDialog";
function SidebarShell({
  children,
  fetchedWorkspaces,
}: {
  children: React.ReactNode;
  fetchedWorkspaces: any;
}) {
  const params = useParams();
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const [activeWsProjects, setActiveWsProjects] = React.useState<TProject[]>(
    []
  );
  const workspaces = useWorkspaces();
  let roles = useUserRoles();

  const project = workspaces
    .find((ws) => ws.slug == params.workspace?.toString())
    ?.projects.find((p) => p.slug == params.project?.toString());
  const workspace = workspaces.find(
    (ws) => ws.slug == params.workspace?.toString()
  );
  let userRolesForCurrentProject;
  userRolesForCurrentProject = useRolesforProject(project?.id!);
  const userRolesForCurrentWs = useRolesforWs(workspace?.id!);
  const isAuthorized =
    AUTHORIZED_ROLES.includes(userRolesForCurrentWs?.role as string) ||
    AUTHORIZED_ROLES.includes(userRolesForCurrentProject?.role as string);
  function getActiveWorkspaceProjects() {
    let activeWs = workspaces!.find(
      (ws: TWorkspace) => ws.slug === params.workspace?.toString()
    ) as TWorkspace;
    setActiveWsProjects(activeWs?.projects);
  }
  useEffect(() => {
    getActiveWorkspaceProjects();
  });
  return (
    <>
      <SidebarProvider>
        <AppSidebar w={fetchedWorkspaces as any} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {/* <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      {normalizeString(params.workspace?.toString()!)}
                    </BreadcrumbLink>
                  </BreadcrumbItem> */}
                  <DropdownMenu
                    open={dropDownOpen}
                    onOpenChange={setDropDownOpen}>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-5 text-sm font-medium border-0 ">
                        {normalizeString(params.workspace?.toString()!)}

                        <ChevronRightIcon
                          className={`h-4 w-4 opacity-70 transition-transform duration-200 ${
                            dropDownOpen ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                    </DropdownMenuTrigger>
                    {openCreateProject && (
                      <CreateProjectDialog
                        open={openCreateProject}
                        onOpenChange={() =>
                          setOpenCreateProject(!openCreateProject)
                        }
                        workspaceId={params.workspace?.toString()}
                      />
                    )}
                    <DropdownMenuContent
                      align="start"
                      sideOffset={8}
                      className={`
          w-40 rounded-lg p-1 shadow-lg border bg-popover
        `}>
                      {activeWsProjects?.map((p) => (
                        <DropdownMenuItem
                          className="flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer
          hover:bg-muted hover:text-foreground transition">
                          {normalizeString(p.slug)}
                        </DropdownMenuItem>
                      ))}
                      {isAuthorized && (
                        <DropdownMenuItem
                          className="flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer
          hover:bg-muted hover:text-foreground transition"
                          onClick={() => setOpenCreateProject(true)}>
                          Create Project
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* <BreadcrumbSeparator className="hidden md:block" /> */}
                  <BreadcrumbItem>
                    {params?.project?.toString() && (
                      <BreadcrumbPage>
                        {normalizeString(params?.project?.toString()!)}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2 px-4">
              <NotificationDropdown />
              <ModeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
            {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div> */}
            {children}
            {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default SidebarShell;
