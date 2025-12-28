"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardQueryOptions } from "@/lib/react-query/dashboard.query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bell, Calendar, CheckCircle2, Flame } from "lucide-react";
import { User } from "next-auth";

export default function DashboardClient({ user }: { user?: User }) {
  const { data, isLoading } = useQuery(dashboardQueryOptions);
  if (isLoading || !data) {
    return <div className="p-6 text-muted-foreground">Loading dashboard…</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Hello, {user?.name ?? "Abhishek"} 👋
        </h1>
        <p className="text-muted-foreground">
          Here’s what you need to focus on today
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Assigned" value={data.stats.assigned} />
        <Stat title="Due Today" value={data.stats.dueToday} />
        <Stat title="Overdue" value={data.stats.overdue} danger />
        <Stat title="Urgent" value={data.stats.urgent} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TaskSection title="Today’s Tasks" tasks={data.todayTasks} />
          <TaskSection title="Upcoming Tasks" tasks={data.upcomingTasks} />
          <UrgentTasks tasks={data.urgentTasks} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={18} /> Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.recentActivities?.map((a) => (
                <div key={a.id} className="text-sm">
                  <p>{a.message}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={18} /> Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Finish urgent tasks first to reduce stress.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({
  title,
  value,
  danger,
  accent,
}: {
  title: string;
  value: number;
  danger?: boolean;
  accent?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div
          className={`text-2xl font-bold ${
            danger ? "text-red-600" : accent ? "text-orange-500" : ""
          }`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function TaskSection({ title, tasks }: { title: string; tasks: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks 🎉</p>
        ) : (
          tasks.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between border rounded-md p-3">
              <div>
                <p className="font-medium">{t.title}</p>
                {t.dueDate && (
                  <p className="text-xs text-muted-foreground">
                    Due {new Date(t.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              {t.status === "DONE" ? (
                <CheckCircle2 className="text-green-500" />
              ) : (
                <AlertCircle className="text-yellow-500" />
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function UrgentTasks({ tasks }: { tasks: any[] }) {
  if (tasks.length === 0) return null;

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Flame size={18} /> Urgent Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((t) => (
          <div key={t.id} className="flex items-center justify-between text-sm">
            <span>{t.title}</span>
            <Badge variant="destructive">URGENT</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
