// components/task/TaskPage.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import TaskDetailPage from "@/components/task/TaskDetailPage";
import { fetchTaskById } from "@/lib/api/task/task";

export default function TaskPage({ taskId }: { taskId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTaskById(taskId),
  });

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading task…</div>;
  }

  if (error || !data) {
    return <div className="p-6 text-red-500">Task not found</div>;
  }

  return <TaskDetailPage task={data} />;
}
