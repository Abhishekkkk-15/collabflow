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
  params: { workspace: string; project: string };
}) {
  const cookieStore = cookies();
  const { workspace, project } = await params;
  let tasks;
  try {
    tasks = await api.get(`/task?wsSlug=${workspace}&pSlug=${project}`, {
      headers: {
        Cookie: (await cookieStore).toString(),
      },
      withCredentials: true,
    });
    console.log("tasks", tasks.data);
  } catch (error) {
    console.log("tasks", error);
  }
  return (
    <>
      <TasksTable project={project} fetchedTasks={tasks?.data} />
    </>
  );
}

export default page;
