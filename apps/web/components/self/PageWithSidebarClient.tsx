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
import { ComponentProps, ComponentType } from "react";
import TasksTable from "@/components/self/TasksTable";

import { AppSidebar } from "../app-sidebar";
import { ModeToggle } from "../ModeToggle";
import NotificationDropdown from "./NotificationDropdown";
export type UserRole = "USER" | "ADMIN" | "OWNER";
import { type User } from "@collabflow/types";
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
                <BreadcrumbLink href="#">
                  {params.workspace?.replace("-", " ")}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
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
