import { api } from "@/lib/api/api";

export async function fetchTaskById(taskId: string) {
  const res = await api.get(`/api/proxy/task/${taskId}`);
  return res.data;
}
