import React, { ComponentType, FC, JSX } from "react";
import { Empty } from "@/components/ui/empty";
import PageWithSidebarClient from "@/components/self/PageWithSidebarClient";
import DefaultDashboard from "@/components/self/DefaultDashboard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Session } from "@collabflow/types";
import ClientSessionSync from "@/components/helper/ClientSessionSync";

async function Page() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <div>
      <PageWithSidebarClient
        Component={DefaultDashboard}
        params={{ project: "", workspace: "" }}
      />
    </div>
  );
}
export default Page;
