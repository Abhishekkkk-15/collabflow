import TasksTable from "@/components/self/TasksTable";
import { api } from "@/lib/api/api";
import { Task, User } from "@prisma/client";
import { cookies } from "next/headers";
interface IExtendedTask extends Task {
  assignees: { user: User }[];
}
async function page({
  params,
}: {
  params: { workspaceSlug: string; projectSlug: string };
}) {
  const cookieStore = cookies();
  const { workspaceSlug, projectSlug } = await params;
  let tasks;
  try {
    tasks = await api.get(
      `/task?wsSlug=${workspaceSlug}&pSlug=${projectSlug}`,
      {
        headers: {
          Cookie: (await cookieStore).toString(),
        },
        withCredentials: true,
      }
    );
    console.log("tasks", tasks.data);
  } catch (error) {
    console.log("tasks", error);
  }
  return (
    <>
      <TasksTable project={projectSlug} fetchedTasks={tasks?.data} />
    </>
  );
}

export default page;
