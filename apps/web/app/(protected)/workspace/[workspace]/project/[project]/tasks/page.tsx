import TasksTable from "@/components/self/TasksTable";
import getQueryClient from "@/lib/react-query/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchTasks } from "@/lib/api/task/fetchTasks";
import { serverFetch } from "@/lib/api/server-fetch";

async function page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const { workspace, project } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tasks", { workspace, project, page: 1, query: "" }],
    queryFn: async () => {
      const res = await serverFetch(
        `/task?wsSlug=${workspace}&pSlug=${project}&page=1&limit=10`
      );
      const data = await res.json();
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksTable workspace={workspace} project={project} />
    </HydrationBoundary>
  );
}

export default page;
