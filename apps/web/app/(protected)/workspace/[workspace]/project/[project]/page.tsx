import ProjectDetails from "@/components/project/ProjectDetails";
import { api } from "@/lib/api/api";
import { fetchProject } from "@/lib/api/project/fetchProjectDetails";
import getQueryClient from "@/lib/react-query/query-client";
import { Task } from "@prisma/client";
import { Axios } from "axios";
import { cookies } from "next/headers";

async function page({
  params,
}: {
  params: { project: string; workspace: string };
}): Promise<any> {
  const { project } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["project", project],
    queryFn: async () => fetchProject(project),
  });

  return (
    <div>
      <ProjectDetails slug={project} />
    </div>
  );
}

export default page;
