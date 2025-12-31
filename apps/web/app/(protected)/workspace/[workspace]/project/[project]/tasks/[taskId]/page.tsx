// app/(workspace)/tasks/[taskId]/page.tsx

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/react-query/query-client";
import TaskPage from "@/components/task/TaskPage";
import { api } from "@/lib/api/api";
import { fetchTaskById } from "@/lib/api/task/task";

interface PageProps {
  params: { taskId: string };
}

export default async function Page({ params }: PageProps) {
  const queryClient = getQueryClient();
  const { taskId } = await params;
  await queryClient.prefetchQuery({
    queryKey: ["task", params.taskId],
    queryFn: () => fetchTaskById(params.taskId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskPage taskId={taskId} />
    </HydrationBoundary>
  );
}
