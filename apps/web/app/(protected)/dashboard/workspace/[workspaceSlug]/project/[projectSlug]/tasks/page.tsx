import TasksTable from "@/components/self/TasksTable";
import { cookies } from "next/headers";
import getQueryClient from "@/lib/react-query/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import { CircleArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchTasks } from "@/lib/api/task/fetchTasks";

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
    queryFn: async () => fetchTasks(workspaceSlug, projectSlug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <section className="space-y-4 p-4">
          <header>
            <h1 className="text-xl font-semibold">Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Manage tasks for this project
            </p>
          </header>
          <TasksTable workspace={workspaceSlug} project={projectSlug} />
        </section>
      </div>
    </HydrationBoundary>
  );
}

export default page;
