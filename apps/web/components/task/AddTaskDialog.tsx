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

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Plus, Loader2, Check } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import type {
  Task,
  Status as TStatus,
  TaskPriority,
  User,
} from "@collabflow/types";
import { api } from "@/lib/api/api";

type AddTaskDialogProps = {
  visibleFields: string[];
  onCreate?: (task: Task) => void;
  createApi?: (payload: Partial<Task>) => Promise<Task>;
  project: string;
};

const DEFAULT_STATUSES: TStatus[] = [
  "Todo",
  "In Progress",
  "Backlog",
  "Done",
  "Canceled",
];

const DEFAULT_PRIORITIES: TaskPriority[] = ["Low", "Medium", "High"];

export default function AddTaskDialog({
  visibleFields,
  onCreate,
  createApi,
  project,
}: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState<TStatus>("Todo");
  const [priority, setPriority] = useState<TaskPriority>("Medium");

  const [assignedTo, setAssignedTo] = useState<User[]>([]);
  const [openMembersPopover, setOpenMembers] = useState(false);

  const [loading, setLoading] = useState(false);
  const taskRef = useRef(Math.floor(Math.random() * 900 + 1000));
  const showId = visibleFields.includes("id");
  const showTag = visibleFields.includes("tag");
  const showTitle = visibleFields.includes("title");
  const showStatus = visibleFields.includes("status");
  const showPriority = visibleFields.includes("priority");

  async function fetchProjectUsers() {
    try {
      return (await api.get(`/project/${project}/members`)).data;
    } catch (error) {
      return [];
    }
  }

  /** toggle multi-select */
  function toggleUser(u: User) {
    const exists = assignedTo.some((x) => x.id === u.id);
    if (exists) {
      setAssignedTo((prev) => prev.filter((x) => x.id !== u.id));
    } else {
      setAssignedTo((prev) => [...prev, u]);
    }
  }

  useEffect(() => {
    (async () => {
      let m = await fetchProjectUsers();
      console.log("m", m.members);
      setMembers(m.members);
    })();
  }, []);

  function reset() {
    setTitle("");
    setTag("");
    setDescription("");
    setAssignedTo([]);
    setStatus("Todo");
    setPriority("Medium");
  }

  async function handleSubmit() {
    if (showTitle && !title.trim()) {
      alert("Title required");
      return;
    }

    setLoading(true);

    try {
      const newTask: Task = {
        id: taskRef.current.toString(),
        title,
        tag,
        description,
        status,
        priority,
        assignedTo: assignedTo.map((u) => u.id),
      };

      let created = newTask;
      if (createApi) created = await createApi(newTask);

      onCreate?.(created);
      reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 bg-primary text-primary-foreground">
          <Plus size={16} /> Add Task
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg p-5">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Task ID */}
          {showId && (
            <p className="text-xs text-muted-foreground">
              ID:{" "}
              <span className="font-mono">{`TASK-${Math.floor(
                Math.random() * 90000 + 1000
              )}`}</span>
            </p>
          )}

          {/* Title */}
          {showTitle && (
            <div className="grid gap-1">
              <label className="text-xs font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Fix login error"
                autoFocus
              />
            </div>
          )}

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

          {/* Tag */}
          {showTag && (
            <div className="grid gap-1">
              <label className="text-xs font-medium">Tag</label>
              <Input
                placeholder="Feature, Bug, Docs..."
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </div>
          )}

          {/* Assigned To */}
          <div className="grid gap-1">
            <label className="text-xs font-medium">Assigned To</label>

            <Popover open={openMembersPopover} onOpenChange={setOpenMembers}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex min-h-[38px] items-center gap-2 w-full rounded-md border px-3 py-2 text-sm hover:bg-accent">
                  {assignedTo.length === 0 ? (
                    <span className="text-muted-foreground">Select users…</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {assignedTo.map((u) => (
                        <div
                          key={u.id}
                          className="flex items-center gap-1 bg-muted border px-2 py-0.5 rounded-full text-xs">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={u.image || ""} />
                            <AvatarFallback>{u.name?.[0]}</AvatarFallback>
                          </Avatar>
                          {u.name}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleUser(u);
                            }}
                            className="text-muted-foreground hover:text-foreground">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-2 space-y-1 ">
                {members!.map((m) => {
                  const selected = assignedTo.some((u) => u.id === m.id);

                  return (
                    <div
                      key={m?.user?.id}
                      onClick={() => toggleUser(m?.user)}
                      className={`flex items-center gap-3 w-full px-2 py-2 rounded-md cursor-pointer hover:bg-muted transition  ${
                        selected ? "bg-muted" : ""
                      }`}>
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={m?.user?.image ?? ""} />
                        <AvatarFallback>{m?.user?.name?.[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">{m?.user?.name}</div>

                      <div
                        className={`border h-4 w-4 flex items-center justify-center rounded-sm ${
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

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-2">
            {showStatus && (
              <div className="grid gap-1 w-full">
                <label className="text-xs font-medium">Status</label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as TStatus)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showPriority && (
              <div className="grid gap-1 w-full">
                <label className="text-xs font-medium">Priority</label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as TaskPriority)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" /> Creating
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
