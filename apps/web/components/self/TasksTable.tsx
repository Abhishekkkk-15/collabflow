"use client";

import React, { JSX, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import {
  Filter,
  Settings,
  ArrowUpDown,
  MoreHorizontal,
  Check,
  Circle,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Task, TaskPriority, TaskStatus, TaskTag, User } from "@prisma/client";
import AddTaskDialog from "../task/AddTaskDialog";
import { api } from "@/lib/api/api";
import { toast } from "sonner";

interface IExtendedTask extends Task {
  assignees: { user: User }[];
}

export default function TasksTable({
  project,
  fetchedTasks,
}: {
  project: string;
  fetchedTasks: IExtendedTask[];
}) {
  const [tasks, setTasks] = useState<IExtendedTask[]>(fetchedTasks || []);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [visibleFields, setVisibleFields] = useState<string[]>([
    "id",
    "title",
    "description",
    "status",
    "priority",
    "tags",
    "dueDate",
    "assignees",
  ]);

  const statuses = ["ALL", "TODO", "IN_PROGRESS", "BLOCKED", "DONE", "REVIEW"];
  const priorities = ["ALL", "LOW", "MEDIUM", "HIGH"];

  // Toggle column visibility
  function toggleField(field: string) {
    setVisibleFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  }

  const allFields = [
    { key: "id", label: "Task ID" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "tags", label: "Tags" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "dueDate", label: "Due Date" },
    { key: "assignees", label: "Assigned To" },
  ];

  // Status Icons
  const statusIcons: Record<TaskStatus, JSX.Element> = {
    TODO: (
      <span className="flex items-center gap-2">
        <Circle className="h-3 w-3 text-gray-400" /> Todo
      </span>
    ),
    IN_PROGRESS: (
      <span className="flex items-center gap-2">
        <Loader2 className="h-3 w-3 text-blue-500 animate-spin" /> In Progress
      </span>
    ),
    BLOCKED: (
      <span className="flex items-center gap-2">
        <Clock className="h-3 w-3 text-orange-500" /> Backlog
      </span>
    ),
    DONE: (
      <span className="flex items-center gap-2">
        <CheckCircle2 className="h-3 w-3 text-green-500" /> Done
      </span>
    ),
    REVIEW: (
      <span className="flex items-center gap-2">
        <XCircle className="h-3 w-3 text-red-500" /> Canceled
      </span>
    ),
  };

  // Tag Colors
  const tagColors: Record<TaskTag, string> = {
    BUG: "bg-red-100 text-red-700 border-red-200",
    FEATURE: "bg-purple-100 text-purple-700 border-purple-200",
    IMPROVEMENT: "bg-blue-100 text-blue-700 border-blue-200",
    REFACTOR: "bg-yellow-100 text-yellow-700 border-yellow-200",
    DESIGN: "bg-pink-100 text-pink-700 border-pink-200",
    DOCUMENTATION: "bg-gray-100 text-gray-700 border-gray-200",
    FRONTEND: "bg-green-100 text-green-700 border-green-200",
    BACKEND: "bg-indigo-100 text-indigo-700 border-indigo-200",
    DATABASE: "bg-orange-100 text-orange-700 border-orange-200",
    SECURITY: "bg-rose-100 text-rose-700 border-rose-200",
    PERFORMANCE: "bg-teal-100 text-teal-700 border-teal-200",
  };

  const filteredTasks = tasks.filter((t) => {
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchPriority =
      priorityFilter === "ALL" || t.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  async function handleTaskDelete(id: string) {
    try {
      await api.delete(`/task/${id}`);
      toast.info("Task deleted", {
        position: "top-center",
      });
      setTasks((prev) => {
        return prev.filter((t) => t.id !== id);
      });
    } catch (error: any) {
      toast.error("Error while deleting task", {
        position: "top-center",
        description: error.data.message,
      });
    }
  }

  return (
    <div>
      {/* ---------------------- TOP TOOLBAR ---------------------- */}
      <div className="p-4 flex justify-between items-center">
        {/* LEFT: filter area */}
        <div className="flex gap-2 items-center">
          <Input placeholder="Filter tasks..." className="w-64" />

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter size={16} /> Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 p-1">
              {statuses.map((s) => (
                <div
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 text-sm rounded-md cursor-pointer 
                  hover:bg-muted flex justify-between
                  ${statusFilter === s ? "bg-muted" : ""}`}>
                  {s}
                  {statusFilter === s && <Check size={14} />}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priority Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter size={16} /> Priority
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 p-1">
              {priorities.map((p) => (
                <div
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted flex justify-between
                  ${priorityFilter === p ? "bg-muted" : ""}`}>
                  {p}
                  {priorityFilter === p && <Check size={14} />}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* RIGHT: Add + View */}
        <div className="flex gap-2">
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Settings size={16} /> View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 p-1">
              {allFields.map((f) => (
                <div
                  key={f.key}
                  className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-muted"
                  onClick={() => toggleField(f.key)}>
                  <Checkbox checked={visibleFields.includes(f.key)} />
                  {f.label}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <AddTaskDialog
            projectId={project}
            onCreate={(task) => setTasks((prev) => [task, ...prev])}
          />
        </div>
      </div>

      {/* ---------------------- TABLE ---------------------- */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground uppercase text-xs border-b">
            <tr>
              <th className="p-3 w-[40px]">
                <Checkbox />
              </th>
              {visibleFields.includes("id") && <th className="p-3">ID</th>}
              {visibleFields.includes("title") && (
                <th className="p-3">Title</th>
              )}
              {visibleFields.includes("description") && (
                <th className="p-3">Description</th>
              )}
              {visibleFields.includes("tags") && <th className="p-3">Tags</th>}
              {visibleFields.includes("status") && (
                <th className="p-3">Status</th>
              )}
              {visibleFields.includes("priority") && (
                <th className="p-3">Priority</th>
              )}
              {visibleFields.includes("dueDate") && (
                <th className="p-3">Due</th>
              )}
              {visibleFields.includes("assignees") && (
                <th className="p-3">Assigned</th>
              )}
              <th className="p-3 w-[50px]"></th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-t hover:bg-muted/20">
                <td className="p-3">
                  <Checkbox />
                </td>

                {visibleFields.includes("id") && (
                  <td className="p-3 font-medium">
                    TASK-{task.id.slice(-4).toUpperCase()}
                  </td>
                )}

                {visibleFields.includes("title") && (
                  <td className="p-3">{task.title}</td>
                )}

                {visibleFields.includes("description") && (
                  <td className="p-3 max-w-[300px] truncate">
                    {task.description}
                  </td>
                )}

                {visibleFields.includes("tags") && (
                  <td className="p-3 space-x-1">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 rounded-md text-xs border ${tagColors[tag]}`}>
                        {tag}
                      </span>
                    ))}
                  </td>
                )}

                {visibleFields.includes("status") && (
                  <td className="p-3">{statusIcons[task.status]}</td>
                )}

                {visibleFields.includes("priority") && (
                  <td className="p-3">{task.priority}</td>
                )}

                {visibleFields.includes("dueDate") && (
                  <td className="p-3 text-muted-foreground">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"}
                  </td>
                )}

                {visibleFields.includes("assignees") && (
                  <td className="p-3">
                    <div className="flex -space-x-2">
                      {task.assignees.map((a) => (
                        <Avatar
                          key={a.user.id}
                          className="h-6 w-6 border rounded-full">
                          <AvatarImage src={a.user.image ?? ""} />
                          <AvatarFallback>{a.user.name?.[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </td>
                )}

                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="p-1">
                      <div className="px-2 py-1 text-sm hover:bg-muted rounded">
                        Edit
                      </div>
                      <div
                        className="px-2 py-1 text-sm hover:bg-muted rounded"
                        onClick={() => handleTaskDelete(task.id)}>
                        Delete
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
