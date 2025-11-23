import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PageWithSidebarClient from "./PageWithSidebarClient";
import { ComponentType } from "react";
import PageWithSidebar from "./PageWithSidebar";

export default async function PageWithSidebarServer() {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <AppSidebar user={session}/>
  );
}
