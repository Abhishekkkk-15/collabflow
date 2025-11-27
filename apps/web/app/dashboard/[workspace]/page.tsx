import PageWithSidebarClient from "@/components/self/PageWithSidebarClient";
import WorkspaceDetails from "@/components/workspace/WorkspaceDetails";
import React from "react";

async function page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const { workspace, project } = await params;

  return (
    <div>
      <PageWithSidebarClient
        Component={WorkspaceDetails}
        params={{ project: "", workspace: "" }}
      />
    </div>
  );
}

export default page;
