"use client";

import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { Plus, Loader2, Check } from "lucide-react";

import type {
  TaskStatus,
  TaskPriority,
  TaskTag,
  User,
} from "@collabflow/types";

import { api } from "@/lib/api/api";
import { useParams } from "next/navigation";
import {
  useActiveProject,
  useWorkspace,
} from "@/lib/redux/hooks/use-workspaces";
import { TaskSchema } from "@/lib/validator/taskSchema";
import { handleAddTask } from "@/lib/api/task/addTask";
import { ZodIssue } from "zod";
import { toast } from "sonner";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchProjectMembers } from "@/lib/api/project/members";

const STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "BLOCKED",
];
const PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const TAGS: TaskTag[] = [
  "BUG",
  "FEATURE",
  "IMPROVEMENT",
  "REFACTOR",
  "DESIGN",
  "DOCUMENTATION",
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "SECURITY",
];

type AddTaskDialogProps = {
  projectId: string;
  onCreate?: (t: any) => void;
};

export default function AddTaskDialog({
  projectId,
  onCreate,
}: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const [tags, setTags] = useState<TaskTag[]>([]);
  // const [members, setMembers] = useState<User[]>([]);
  const [assignees, setAssignees] = useState<any[]>([]);

  const [openMemberSelect, setOpenMemberSelect] = useState(false);
  const [openTagSelect, setOpenTagSelect] = useState(false);

  const [loading, setLoading] = useState(false);
  const [validationIssues, setValidationIssues] = useState<ZodIssue[]>();
  const { workspace } = useParams();

  const ws = useWorkspace(workspace?.toString());
  const proj = useActiveProject();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const { data, isFetched } = useQuery({
    queryKey: ["project-members", debouncedQuery, projectId],
    queryFn: async () => fetchProjectMembers(projectId, 10, 1, debouncedQuery),
    enabled: !!projectId,
  });

  console.log("data", data);
  function toggleTag(tag: TaskTag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }
  console.log(query);
  function toggleAssignee(u: User) {
    setAssignees((prev) =>
      prev.some((x) => x.id === u.id)
        ? prev.filter((x) => x.id !== u.id)
        : [...prev, u]
    );
  }

  function reset() {
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setPriority("MEDIUM");
    setTags([]);
    setAssignees([]);
    setDueDate(undefined);
  }

  // const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(t);
  }, [query]);
  async function handleSubmit() {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    const taskTempId = uuidv4();

    setLoading(true);
    const payload = {
      id: taskTempId,
      title,
      description,
      status,
      priority,
      tags,
      assignedTo: assignees,
      dueDate: dueDate ?? null,
      projectId: projectId,
    };
    const parsed = TaskSchema.safeParse(payload);
    if (!parsed.success) {
      setValidationIssues(parsed.error.issues);
      setLoading(false);
      toast.error("Please correct the errors.", {
        position: "top-center",
        richColors: true,
        duration: 3000,
      });
      return;
    }
    const dataToSend = parsed.data;
    if (!dataToSend) return;
    try {
      const res = await handleAddTask(dataToSend);
      console.log(res);
      onCreate?.(res.data);
      reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Task creation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 bg-primary text-primary-foreground w-full">
          <Plus size={16} /> Add Task
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg p-5">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div className="grid gap-1">
            <label className="text-xs font-medium">Title</label>
            <Input
              placeholder="Implement search bar..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="grid gap-1">
            <label className="text-xs font-medium">Description</label>
            <Textarea
              rows={3}
              placeholder="Describe the task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="grid gap-1">
            <label className="text-xs font-medium">Tags</label>

            <Popover open={openTagSelect} onOpenChange={setOpenTagSelect}>
              <PopoverTrigger asChild>
                <button className="flex flex-wrap min-h-[38px] gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent">
                  {tags.length === 0 ? (
                    <span className="text-muted-foreground">Select tags…</span>
                  ) : (
                    tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 bg-muted border rounded-full text-xs">
                        {t}
                      </span>
                    ))
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent className="p-2 w-full space-y-1">
                {TAGS.map((t) => {
                  const selected = tags.includes(t);
                  return (
                    <div
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`flex justify-between items-center px-2 py-2 rounded cursor-pointer hover:bg-muted ${
                        selected ? "bg-muted" : ""
                      }`}>
                      {t}
                      {selected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  );
                })}
              </PopoverContent>
            </Popover>
          </div>

          {/* Assignees */}
          <div className="grid gap-1">
            <label className="text-xs font-medium">Assigned To</label>

            <Popover open={openMemberSelect} onOpenChange={setOpenMemberSelect}>
              <PopoverTrigger asChild>
                <button className="flex flex-wrap min-h-[38px] gap-2 border px-3 py-2 rounded-md text-sm hover:bg-accent">
                  {assignees.length === 0 ? (
                    <span className="text-muted-foreground">Select users…</span>
                  ) : (
                    assignees.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center gap-1 px-2 py-1 border rounded-full bg-muted text-xs">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={u.image ?? ""} />
                          <AvatarFallback>{u.name?.[0]}</AvatarFallback>
                        </Avatar>
                        {u.name}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAssignee(u);
                          }}>
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent className="p-2 w-full space-y-1">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {data?.map((u: { user: User }) => {
                  const selected = assignees.some((x) => x.id === u.user.id);
                  return (
                    <div
                      key={u.user.id}
                      onClick={() => toggleAssignee(u.user)}
                      className={`flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-muted rounded ${
                        selected ? "bg-muted" : ""
                      }`}>
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={u.user.image ?? ""} />
                        <AvatarFallback>{u.user.name?.[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">{u.user.name}</div>

                      <div
                        className={`h-4 w-4 border rounded-sm flex items-center justify-center ${
                          selected ? "bg-primary border-primary" : ""
                        }`}>
                        {selected && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </PopoverContent>
            </Popover>
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label className="text-xs font-medium">Status</label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-medium">Priority</label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="grid gap-1">
            <label className="text-xs font-medium">Due Date</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start w-full">
                  {dueDate ? dueDate.toDateString() : "Select due date"}
                </Button>
              </PopoverTrigger>

              <PopoverContent>
                <Calendar
                  mode="single" // ✅ IMPORTANT
                  selected={dueDate} // now valid
                  onSelect={setDueDate} // now valid
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" /> Creating…
              </span>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
