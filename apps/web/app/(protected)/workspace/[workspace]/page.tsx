import WorkspaceDetails from "@/components/workspace/workspaceDetails/WorkspaceDetails";
import { api } from "@/lib/api/api";
import React from "react";

async function page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const workspaceSlug = await params;
  const workspace = await api.get(`/workspace/${workspaceSlug.workspace}`);
  return <WorkspaceDetails workspace={workspace.data} />;
}

export default page;
