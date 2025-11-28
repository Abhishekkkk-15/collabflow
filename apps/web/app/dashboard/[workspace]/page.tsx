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
      <WorkspaceDetails />
    </div>
  );
}

export default page;
