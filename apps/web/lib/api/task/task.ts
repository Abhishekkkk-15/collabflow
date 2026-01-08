"use server";
export async function fetchTaskById(taskId: string) {
  const res = await fetch(`/api/proxy/task/${taskId}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}
