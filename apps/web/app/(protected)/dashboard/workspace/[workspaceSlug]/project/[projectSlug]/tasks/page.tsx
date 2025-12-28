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
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tasks", { workspaceSlug, projectSlug, page: 1, query: "" }],
    queryFn: async () => {
      const res = await api.get(
        `/task?wsSlug=${workspaceSlug}&pSlug=${projectSlug}&page=1&limit=10`,
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
      <section className="space-y-4 p-4">
        <header>
          <h1 className="text-xl font-semibold">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage tasks for this project
          </p>
        </header>
        <TasksTable workspace={workspaceSlug} project={projectSlug} />
      </section>
    </HydrationBoundary>
  );
}

export default page;
