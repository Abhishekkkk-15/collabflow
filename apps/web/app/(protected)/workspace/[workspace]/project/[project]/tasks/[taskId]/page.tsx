// app/(workspace)/tasks/[taskId]/page.tsx

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/react-query/query-client";
import TaskPage from "@/components/task/TaskPage";
import { fetchTaskById } from "@/lib/api/task/task";
import { serverFetch } from "@/lib/api/server-fetch";

interface PageProps {
  params: { taskId: string };
}

export default async function Page({ params }: PageProps) {
  const queryClient = getQueryClient();
  const { taskId } = await params;

  await queryClient.prefetchQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const res = await serverFetch(`/task/${taskId}`);
      const data = await res.json();
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskPage taskId={taskId} />
    </HydrationBoundary>
  );
}
