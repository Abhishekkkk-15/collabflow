"use client";
import React, { JSX, use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  MoreHorizontal,
  Filter,
  Plus,
  Settings,
  Check,
  XCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Circle,
} from "lucide-react";
import { Status, Task, TaskPriority, type User } from "@collabflow/types";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useSelector } from "react-redux";

export default function TasksTable() {
  const user = useSelector((state: any) => state?.user.userRoles);
  console.log("ii", user);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [visibleFields, setVisibleFields] = useState<string[]>([
    "id",
    "title",
    "status",
    "priority",
    "tag",
  ]);
  const statuses = [
    "All",
    "Todo",
    "In Progress",
    "Backlog",
    "Done",
    "Canceled",
  ];
  const priorities = ["All", "Low", "Medium", "High"];
  const tasks: Task[] = [
    {
      id: "TASK-8782",
      tag: "Documentation",
      title:
        "You can't compress the program without quantifying the open-source SSD ...",
      status: "In Progress",
      priority: "Medium",
    },
    {
      id: "TASK-7878",
      tag: "Documentation",
      title:
        "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
      status: "Backlog",
      priority: "Medium",
    },
    {
      id: "TASK-7839",
      tag: "Bug",
      title: "We need to bypass the neural TCP card!",
      status: "Todo",
      priority: "High",
    },
    {
      id: "TASK-5562",
      tag: "Feature",
      title:
        "The SAS interface is down, bypass the open-source pixel so we can back u...",
      status: "Backlog",
      priority: "Medium",
    },
    {
      id: "TASK-8686",
      tag: "Feature",
      title:
        "I'll parse the wireless SSL protocol, that should driver the API panel!",
      status: "Canceled",
      priority: "Medium",
    },
    {
      id: "TASK-1280",
      tag: "Bug",
      title:
        "Use the digital TLS panel, then you can transmit the haptic system!",
      status: "Done",
      priority: "High",
    },
    {
      id: "TASK-7262",
      tag: "Feature",
      title:
        "The UTF8 application is down, parse the neural bandwidth so we can back ...",
      status: "Done",
      priority: "High",
    },
    {
      id: "TASK-1138",
      tag: "Feature",
      title:
        "Generating the driver won't do anything, we need to quantify the 1080p SM...",
      status: "In Progress",
      priority: "Medium",
    },
    {
      id: "TASK-7184",
      tag: "Feature",
      title: "We need to program the back-end THX pixel!",
      status: "Todo",
      priority: "Low",
    },
  ];
  const filteredTasks = tasks.filter(
    (t) =>
      (statusFilter === "All" || t.status === statusFilter) &&
      (priorityFilter === "All" || t.priority === priorityFilter)
  );
  function FilterChip({
    label,
    onRemove,
  }: {
    label: string;
    onRemove: () => void;
  }) {
    return (
      <span
        className="
      flex items-center gap-2
      px-3 py-1.5
      bg-muted/60
      text-sm
      rounded-full border
      hover:bg-muted
      transition
    ">
        {label}
        <button
          onClick={onRemove}
          className="h-4 w-4 flex items-center justify-center rounded-full 
                   hover:bg-foreground/10 text-muted-foreground hover:text-foreground">
          ×
        </button>
      </span>
    );
  }
  function toggleField(fieldKey: string) {
    setVisibleFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((f) => f !== fieldKey)
        : [...prev, fieldKey]
    );
  }
  const allFields = [
    { key: "id", label: "Task ID" },
    { key: "tag", label: "Tag" },
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
  ];

  const statusIcons: Record<Status, JSX.Element> = {
    Todo: (
      <span className="flex items-center gap-2">
        <Circle className="h-3 w-3 text-gray-400" /> Todo
      </span>
    ),
    "In Progress": (
      <span className="flex items-center gap-2">
        <Loader2 className="h-3 w-3 text-blue-500 animate-spin" /> In Progress
      </span>
    ),
    Backlog: (
      <span className="flex items-center gap-2">
        <Clock className="h-3 w-3 text-orange-500" /> Backlog
      </span>
    ),
    Done: (
      <span className="flex items-center gap-2">
        <CheckCircle2 className="h-3 w-3 text-green-500" /> Done
      </span>
    ),
    Canceled: (
      <span className="flex items-center gap-2">
        <XCircle className="h-3 w-3 text-red-500" /> Canceled
      </span>
    ),
  };

  return (
    <div>
      <div className="p-4 w-full bg-background text-foreground">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            <Input placeholder="Filter tasks..." className="w-64" />
            {/* <Button variant="outline" className="flex gap-2"><Filter size={16}/> Status</Button>
           {/* STATUS DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex gap-2 rounded-md shadow-sm">
                  <Filter size={16} /> Status
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={4}
                className="w-40 rounded-lg p-1 shadow-lg border bg-popover">
                {statuses.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`
          flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer
          hover:bg-muted hover:text-foreground transition
          ${statusFilter === s ? "bg-muted text-foreground" : ""}
        `}>
                    {s}
                    {statusFilter === s && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* PRIORITY DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex gap-2 rounded-md shadow-sm">
                  <Filter size={16} /> Priority
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={4}
                className="w-40 rounded-lg p-1 shadow-lg border bg-popover">
                {priorities.map((p) => (
                  <DropdownMenuItem
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`
          flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer
          hover:bg-muted hover:text-foreground transition
          ${priorityFilter === p ? "bg-muted text-foreground" : ""}
        `}>
                    {p}
                    {priorityFilter === p && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* ACTIVE FILTER CHIPS */}
            {/* ACTIVE FILTER CHIPS */}
            <div className="flex gap-2 mt-1">
              {statusFilter !== "All" && (
                <FilterChip
                  label={`Status: ${statusFilter}`}
                  onRemove={() => setStatusFilter("All")}
                />
              )}

              {priorityFilter !== "All" && (
                <FilterChip
                  label={`Priority: ${priorityFilter}`}
                  onRemove={() => setPriorityFilter("All")}
                />
              )}
            </div>
            {/* <Button variant="outline" className="flex gap-2"><Filter size={16}/> Priority</Button> */}
          </div>
          <div className="flex items-center gap-2">
            {/* <Button  variant="outline" className="flex gap-2"><Settings size={16}/> View</Button>
             */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex gap-2 rounded-md shadow-sm">
                  <Settings size={16} /> View
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-48 rounded-lg p-1 shadow-lg border bg-popover">
                {allFields.map((f) => (
                  <DropdownMenuItem
                    key={f.key}
                    onClick={() => toggleField(f.key)}
                    className={`
          flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer
          hover:bg-muted hover:text-foreground transition
        `}>
                    <Checkbox checked={visibleFields.includes(f.key)} />
                    <span className="text-sm">{f.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              disabled={user?.role == "USER" || undefined}
              className="bg-primary text-primary-foreground hover:bg-primary/90  flex gap-2">
              <Plus size={16} /> Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className=" top-0  bg-muted/60 text-muted-foreground text-xs uppercase tracking-wide font-medium border-b">
            <tr>
              <th className="p-3 text-left align-middle w-[48px]">
                <div className="flex items-center justify-center">
                  <Checkbox />
                </div>
              </th>
              {visibleFields.includes("id") && (
                <th className="p-3 text-left align-middle w-[140px]">
                  <div className="whitespace-nowrap">Task</div>
                </th>
              )}
              {visibleFields.includes("title") && (
                <th className="p-3 text-left align-middle">
                  <div className="whitespace-nowrap">Title</div>
                </th>
              )}
              {visibleFields.includes("status") && (
                <th className="p-3 text-left align-middle cursor-pointer w-[140px]">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span>Status</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
              )}
              {visibleFields.includes("priority") && (
                <th className="p-3 text-left align-middle cursor-pointer w-[110px]">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span>Priority</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
              )}
              <th className="p-3 w-[56px]" />
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <tr
                key={task.id}
                className="border-t hover:bg-muted/20 transition">
                <td className="p-3">
                  <Checkbox />
                </td>
                {visibleFields.includes("id") && (
                  <td className="p-3 font-medium">{task.id}</td>
                )}

                <td className="p-3 max-w-xl truncate flex items-center gap-2">
                  {visibleFields.includes("tag") && (
                    <span className="text-xs px-2 py-1 rounded-full bg-muted/50 border">
                      {task.tag}
                    </span>
                  )}
                  {visibleFields.includes("title") && task.title}
                </td>
                {visibleFields.includes("status") && (
                  <td className="p-3">
                    <span className="flex items-center ">
                      <div className="w-2 h-2  rounded-full" />
                      {statusIcons[task.status]}
                    </span>
                  </td>
                )}
                {visibleFields.includes("priority") && (
                  <td className="p-3">{task.priority}</td>
                )}

                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <p className="px-2 py-1 text-sm">Edit</p>
                      <p className="px-2 py-1 text-sm">Delete</p>
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
