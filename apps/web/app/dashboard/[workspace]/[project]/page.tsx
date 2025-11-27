import ProjectDetails from "@/components/project/ProjectDetails";
import PageWithSidebarClient from "@/components/self/PageWithSidebarClient";
import { mockProject } from "./mockdata";

async function page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const { workspace, project } = await params;

  return (
    <div>
      <PageWithSidebarClient
        Component={ProjectDetails}
        params={{ project: "", workspace: "" }}
        componentProps={{ project: mockProject }}
      />
    </div>
  );
}

export default page;
