// queries/dashboard.query.ts
import { api } from "@/lib/api/api";
import { serverFetch } from "../api/server-fetch";
export type Task = {
  id: string;
  title: string;
  dueDate?: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";
};

export type DashboardData = {
  stats: {
    assigned: number;
    dueToday: number;
    overdue: number;
    urgent: number;
  };
  todayTasks: Task[];
  upcomingTasks: Task[];
  urgentTasks: Task[];
  recentActivities: {
    id: string;
    message: string;
    createdAt: string;
  }[];
};

export const dashboardQueryOptions = {
  queryKey: ["dashboard", "me"],
  queryFn: async (): Promise<DashboardData> => {
    const { data } = await api.get("/api/proxy/user/dashboard/me", {});
    return data;
  },
};
export async function fetchDashboardServer() {
  return serverFetch("/api/proxy/user/dashboard/me");
}
