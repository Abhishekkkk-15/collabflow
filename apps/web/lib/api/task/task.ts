import { api } from "@/lib/api/api";

export async function fetchTaskById(taskId: string) {
  const res = await api.get(`/task/${taskId}`);
  return res.data;
}
