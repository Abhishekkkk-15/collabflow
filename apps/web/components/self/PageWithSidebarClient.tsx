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
import { ComponentProps, ComponentType, useState } from "react";
import { ChevronDownIcon, SlashIcon } from "lucide-react";
import { AppSidebar } from "../app-sidebar";
import { ModeToggle } from "../ModeToggle";
import NotificationDropdown from "./NotificationDropdown";
export type UserRole = "USER" | "ADMIN" | "OWNER";
import { type User } from "@collabflow/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { CreateProjectDialog } from "./CreateProjectDialog";
type IProps = ComponentProps<typeof Sidebar> & { user: User };
type Props = {
  user: any;
  Component: ComponentType<{ user: any }>;
  params: { workspace?: string; project?: string };
};
export default function PageWithSidebarClient({
  params,
  user,
  Component,
}: Props) {
  const [openCreateProject, setOpenCreateProject] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar user={user} /> {/* now inside provider */}
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
                      {params.workspace?.replace("-", " ")}
                      <ChevronDownIcon className="h-4 w-4 opacity-70" />
                    </span>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    sideOffset={4}
                    className="
      w-40 
      bg-[#1f1f1f] 
      text-white 
      rounded-lg 
      shadow-lg 
      border border-[#2a2a2a]
      p-1
    ">
                    <DropdownMenuItem className="px-3 py-2 rounded-md hover:bg-[#2a2a2a] cursor-pointer">
                      Project1
                    </DropdownMenuItem>
                    <DropdownMenuItem className="px-3 py-2 rounded-md hover:bg-[#2a2a2a] cursor-pointer">
                      Project1
                    </DropdownMenuItem>
                    <DropdownMenuItem className="px-3 py-2 rounded-md hover:bg-[#2a2a2a] cursor-pointer">
                      Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="px-3 py-2 rounded-md hover:bg-[#2a2a2a] cursor-pointer"
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
                  {params.project?.replace("-", " ")}
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
          <Component user={user} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
