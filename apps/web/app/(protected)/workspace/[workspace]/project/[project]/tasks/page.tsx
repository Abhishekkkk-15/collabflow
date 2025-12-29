import TasksTable from "@/components/self/TasksTable";
import { cookies } from "next/headers";
import getQueryClient from "@/lib/react-query/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { api } from "@/lib/api/api";

async function page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const cookieStore = cookies();
  const { workspace, project } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tasks", { workspace, project, page: 1, query: "" }],
    queryFn: async () => {
      const res = await api.get(
        `/task?wsSlug=${workspace}&pSlug=${project}&page=1&limit=10`,
        {
          headers: {
            Cookie: (await cookieStore).toString(),
          },
          withCredentials: true,
        }
      );
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksTable workspace={workspace} project={project} />
    </HydrationBoundary>
  );
}

export default page;
