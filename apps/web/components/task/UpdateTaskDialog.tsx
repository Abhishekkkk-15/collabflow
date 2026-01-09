"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/api";
import { toast } from "sonner";

interface Props {
  taskId: string;
  currentStatus: TaskStatus;
}

export function UpdateTaskDialog({ taskId, currentStatus }: Props) {
  const [status, setStatus] = useState<TaskStatus>(currentStatus);
  const [note, setNote] = useState("");
  const router = useRouter();
  async function handleSubmit() {
    await api.post(`/api/proxy/task/${taskId}/activity`, { status, note });
    toast.success("Task updated successfully");
    router.refresh();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Update task</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TaskStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Activity note */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Activity note (optional)
            </label>
            <Textarea
              placeholder="What changed?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Save update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
