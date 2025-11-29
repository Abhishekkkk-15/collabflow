import WorkspaceDetails from "@/components/workspace/WorkspaceDetails";
// import WorkspaceDetails from "@/components/workspace/workspaceDetails/WorkspaceDetails";
import { api } from "@/lib/api/api";
import React from "react";

async function page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const workspaceSlug = await params;
  console.log("paramssss", workspaceSlug);
  const workspace = await api.get(`/workspace/${workspaceSlug.workspace}`);
  console.log("workspace fetched", workspace.data);
  return (
    <div>
      <WorkspaceDetails workspace={workspace.data} />

      {/* <WorkspaceDetails workspace={workspace.data} /> */}
    </div>
  );
}

export default page;
