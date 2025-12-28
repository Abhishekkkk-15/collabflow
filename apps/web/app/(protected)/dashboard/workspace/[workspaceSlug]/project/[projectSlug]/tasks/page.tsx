import TasksTable from "@/components/self/TasksTable";
import { cookies } from "next/headers";
import getQueryClient from "@/lib/react-query/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { api } from "@/lib/api/api";

async function page({
  params,
}: {
  params: { workspaceSlug: string; projectSlug: string };
}) {
  const cookieStore = cookies();
  const { workspaceSlug, projectSlug } = await params;
  console.log("wsSlug", workspaceSlug);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tasks", { workspaceSlug, projectSlug, page: 1, query: "" }],
    queryFn: async () => {
      const res = await api.get(
        `/task?wsSlug=${workspaceSlug}&pSlug=${projectSlug}&page=1&limit=10`,
        {
          headers: {
            Cookie: cookieStore.toString(),
          },
          withCredentials: true,
        }
      );
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksTable workspace={workspaceSlug} project={projectSlug} />
    </HydrationBoundary>
  );
}

export default page;
