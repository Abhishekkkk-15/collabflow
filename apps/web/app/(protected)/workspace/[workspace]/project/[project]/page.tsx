import ProjectDetails from "@/components/project/ProjectDetails";
import { api } from "@/lib/api/api";
import { Task } from "@prisma/client";
import { Axios } from "axios";
import { cookies } from "next/headers";

async function page({
  params,
}: {
  params: { project: string; workspace: string };
}): Promise<any> {
  const { project } = await params;
  const cookieStore = cookies();

  async function fetchProject() {
    try {
      const res = await api.get(`/project?slug=${project}`, {
        headers: {
          Cookie: (await cookieStore).toString(),
        },
        withCredentials: true,
      });
      return res;
    } catch (error) {
      console.log("error", error);
    }
  }

  let p = await fetchProject();

  return (
    <div>
      <ProjectDetails
        project={p?.data.project}
        totalTasks={p?.data.totalTasks as number}
        totalMembers={p?.data.totalMembers as number}
        myTasks={p?.data.myTasks as Task[]}
      />
    </div>
  );
}

export default page;
