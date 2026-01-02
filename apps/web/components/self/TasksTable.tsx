"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  Filter,
  Settings,
  MoreHorizontal,
  Check,
  Circle,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  DeleteIcon,
  Trash2,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Project,
  Task,
  TaskStatus,
  TaskTag,
  User,
  Workspace,
} from "@prisma/client";
import { api } from "@/lib/api/api";
import { useQuery } from "@tanstack/react-query";
import Error from "next/error";
import getQueryClient from "@/lib/react-query/query-client";
import { Spinner } from "../ui/spinner";
import TaskDetailDialog from "../task/TaskDetailDialog";
import Link from "next/link";
import { fetchTasks } from "@/lib/api/task/fetchTasks";

interface ExtendedTask extends Task {
  assignees: { user: User }[];
  workspace: Workspace;
  project: Project;
}

interface TasksTableProps {
  project: string;
  workspace: string;
}

const STATUSES: Array<"ALL" | TaskStatus> = [
  "ALL",
  "TODO",
  "IN_PROGRESS",
  "BLOCKED",
  "REVIEW",
  "DONE",
];

const PRIORITIES = ["ALL", "LOW", "MEDIUM", "HIGH"] as const;

const ALL_FIELDS = [
  { key: "id", label: "Task ID" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "tags", label: "Tags" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "dueDate", label: "Due Date" },
  { key: "assignees", label: "Assigned To" },
] as const;

const STATUS_ICONS: Record<TaskStatus, JSX.Element> = {
  TODO: (
    <span className="flex items-center gap-2">
      <Circle className="h-3 w-3 text-muted-foreground" /> Todo
    </span>
  ),
  IN_PROGRESS: (
    <span className="flex items-center gap-2">
      <Loader2 className="h-3 w-3 text-blue-500 animate-spin" /> In Progress
    </span>
  ),
  BLOCKED: (
    <span className="flex items-center gap-2">
      <Clock className="h-3 w-3 text-orange-500" /> Blocked
    </span>
  ),
  DONE: (
    <span className="flex items-center gap-2">
      <CheckCircle2 className="h-3 w-3 text-green-500" /> Done
    </span>
  ),
  REVIEW: (
    <span className="flex items-center gap-2">
      <XCircle className="h-3 w-3 text-red-500" /> Review
    </span>
  ),
};

const TAG_COLORS: Record<TaskTag, string> = {
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

interface TasksResponse {
  tasks: ExtendedTask[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
export default function TasksTable({ project, workspace }: TasksTableProps) {
  const pathname = usePathname();
  const [visibleFields, setVisibleFields] = useState<string[]>(
    ALL_FIELDS.map((f) => f.key)
  );

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(t);
  }, [query]);
  const { data, isFetching } = useQuery<TasksResponse, Error, TasksResponse>({
    queryKey: ["tasks", { workspace, project, page, debouncedQuery }],
    queryFn: async () => fetchTasks(workspace, project),
    keepPreviousData: true,
  });

  const filteredTasks = useMemo(() => {
    if (!data?.tasks) return [];

    return data.tasks.filter((task) => {
      const statusMatch =
        statusFilter === "ALL" || task.status === statusFilter;
      const priorityMatch =
        priorityFilter === "ALL" || task.priority === priorityFilter;

      return statusMatch && priorityMatch;
    });
  }, [data?.tasks, statusFilter, priorityFilter]);

  function toggleField(field: string) {
    setVisibleFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  }

  const queryClient = getQueryClient();

  async function handleDelete(taskId: string) {
    try {
      if (checkedTasks.length > 0) {
        await api.delete(`/task/multi`, {
          data: {
            ids: checkedTasks,
          },
        });

        toast.success("Task deleted");

        queryClient.invalidateQueries({
          queryKey: ["tasks", { workspace, project }],
        });
        return;
      }
      if (taskId == "") return;
      await api.delete(`/task/${taskId}`);
      toast.success("Task deleted");

      queryClient.invalidateQueries({
        queryKey: ["tasks", { workspace, project }],
      });
    } catch {
      toast.error("Failed to delete task");
    }
  }

  function onStatusChange(v: string) {
    setStatusFilter(v);
    setPage(1);
  }

  function onPriorityChange(v: string) {
    setPriorityFilter(v);
    setPage(1);
  }
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
  const [allTasksSelected, setAllTasksSelected] = useState(false);
  function handleToggleCheck(id: string) {
    if (checkedTasks.includes(id)) {
      setCheckedTasks((prev) => prev.filter((i) => i != id));
      return;
    }
    setCheckedTasks((prev) => [...prev, id]);
  }

  function selectAll() {
    if (checkedTasks.length == filteredTasks.length) {
      setCheckedTasks([]);
      setAllTasksSelected(false);
      return;
    }
    setCheckedTasks([]);
    const allTasksId = filteredTasks.map((t) => t.id);
    setCheckedTasks(allTasksId);
    setAllTasksSelected(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search tasks..."
            className="w-64"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />

          <FilterDropdown
            label="Status"
            options={STATUSES}
            value={statusFilter}
            onChange={onStatusChange}
          />

          <FilterDropdown
            label="Priority"
            options={PRIORITIES}
            value={priorityFilter}
            onChange={onPriorityChange}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings size={16} /> View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 p-1">
              {ALL_FIELDS.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-muted"
                  onClick={() => toggleField(field.key)}>
                  <Checkbox checked={visibleFields.includes(field.key)} />
                  {field.label}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {pathname.startsWith("/dashboard") && checkedTasks.length > 0 && (
            <Button
              variant="outline"
              className="gap-2 pr-1 bg-red-500"
              onClick={() => handleDelete("")}>
              <Trash2 size={16} /> Delete
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-muted/40 border-b text-xs uppercase">
            <tr>
              <th className="p-3 w-10" onClick={selectAll}>
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
              {pathname.startsWith("/dashboard") && <th className="p-3 w-10" />}
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-t hover:bg-muted/30">
                <td className="p-3" onClick={() => handleToggleCheck(task.id)}>
                  <Checkbox checked={checkedTasks.includes(task.id)} />
                </td>

                {visibleFields.includes("id") && (
                  <td className="p-3 font-medium">
                    <Link
                      href={`/workspace/${task.workspace.slug}/project/${task.project.slug}/tasks/${task.id}`}>
                      TASK-{task.id.slice(-4).toUpperCase()}
                    </Link>
                  </td>
                )}

                {visibleFields.includes("title") && (
                  <td
                    className="p-3 font-medium cursor-pointer hover:underline"
                    onClick={() => {
                      setSelectedTask(task);
                      setDetailOpen(true);
                    }}>
                    {task.title}
                  </td>
                )}

                {visibleFields.includes("description") && (
                  <td className="p-3 max-w-xs truncate">{task.description}</td>
                )}

                {visibleFields.includes("tags") && (
                  <td className="p-3 space-x-1">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 text-xs border rounded ${TAG_COLORS[tag]}`}>
                        {tag}
                      </span>
                    ))}
                  </td>
                )}

                {visibleFields.includes("status") && (
                  <td className="p-3">{STATUS_ICONS[task.status]}</td>
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
                      {task.assignees.map(({ user }) => (
                        <Avatar key={user.id} className="h-6 w-6 border">
                          <AvatarImage src={user.image ?? ""} />
                          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </td>
                )}

                {pathname.startsWith("/dashboard") && (
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
                          onClick={() => handleDelete(task.id)}>
                          Delete
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {isFetching && (
          <div className="text-center flex justify-center items-center">
            <div className="h-full">
              <Spinner hanging={10} height={20} width={20} />
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          disabled={!data?.hasPrevPage}
          onClick={() => setPage((p) => p - 1)}>
          Prev
        </Button>

        <span className="text-sm">
          Page {page} of {data?.totalPages}
        </span>

        <Button
          variant="outline"
          disabled={!data?.hasNextPage}
          onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
      <TaskDetailDialog
        task={selectedTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}

function FilterDropdown<T extends readonly string[]>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter size={16} /> {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 p-1">
        {options.map((option) => (
          <div
            key={option}
            onClick={() => onChange(option)}
            className={`flex justify-between px-3 py-2 text-sm rounded cursor-pointer hover:bg-muted ${
              value === option ? "bg-muted" : ""
            }`}>
            {option}
            {value === option && <Check size={14} />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
