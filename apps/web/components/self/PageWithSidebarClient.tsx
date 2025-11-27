"use client";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  Sidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, {
  ComponentProps,
  ComponentType,
  useEffect,
  useState,
} from "react";
import { ChevronDownIcon, SlashIcon } from "lucide-react";
import { AppSidebar } from "../app-sidebar";
import { ModeToggle } from "../ModeToggle";
import NotificationDropdown from "./NotificationDropdown";
export type UserRole = "USER" | "ADMIN" | "OWNER";
import { Workspace, type User } from "@collabflow/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { normalizeString } from "@/lib/slugToTitle";
import { SidebarSheet } from "./DraggableSidebar";
import { useAppSelector } from "@/lib/redux/hooks";
import { useSelector } from "react-redux";
import { TProject, TWorkspace } from "@/lib/redux/slices/workspace";
import { se } from "date-fns/locale";
import { useParams } from "next/navigation";
type Props<T> = {
  Component: ComponentType<any>;
  params: { workspace?: string; project?: string };
  componentProps?: Record<string, any>;
};
export default function PageWithSidebarClient<T>({
  Component,
  componentProps,
  params,
}: Props<any>) {
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [activeWsProjects, setActiveWsProjects] = React.useState<TProject[]>(
    []
  );
  const selectedWorkspaces = useSelector(
    (state: any) => state?.workspace?.activeWorkspaceId
  );
  const { workspaces, status } = useAppSelector((s: any) => s?.workspace!);
  function getActiveWorkspaceProjects() {
    let activeWs = workspaces.find(
      (ws: TWorkspace) => ws.slug === params.workspace
    ) as TWorkspace;
    console.log(activeWs?.projects);
    setActiveWsProjects(activeWs?.projects);
  }
  useEffect(() => {
    getActiveWorkspaceProjects();
  }, [openCreateProject]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span className="flex items-center gap-1 text-sm font-medium">
                      {normalizeString(params.workspace!)}
                      <ChevronDownIcon className="h-4 w-4 opacity-70" />
                    </span>
                  </DropdownMenuTrigger>

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
                    <DropdownMenuItem
                      className="flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer
          hover:bg-muted hover:text-foreground transition"
                      onClick={() => setOpenCreateProject(true)}>
                      Create Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <CreateProjectDialog
                  open={openCreateProject}
                  onOpenChange={setOpenCreateProject}
                  workspaceId={params.workspace}
                />
                {/* <BreadcrumbLink href="#">
                  {params.workspace?.replace("-", " ")}
                </BreadcrumbLink> */}
              </BreadcrumbItem>
              {/* <BreadcrumbSeparator className="hidden md:block" /> */}
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {normalizeString(params.project!)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center space-x-1 gap-1">
            <NotificationDropdown />
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Component componentProps={componentProps} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
