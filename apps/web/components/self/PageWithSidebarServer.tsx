import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PageWithSidebarClient from "./PageWithSidebarClient";
import { ComponentType } from "react";

export default async function PageWithSidebarServer() {
  const session = await auth();

  if (!session) redirect("/login");

  return <AppSidebar user={session} />;
}
