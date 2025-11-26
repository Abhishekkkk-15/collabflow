"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarDialog } from "../self/CalendarDialog"; // use your CalendarDialog
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function TaskDetailsSheet({
  open,
  onOpenChange,
  task,
  onSave,
  onDelete,
}: any) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [desc, setDesc] = useState(task?.description ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [priority, setPriority] = useState(task?.priority ?? "MEDIUM");

  useEffect(() => {
    if (task) {
      setTitle(task.title ?? "");
      setDesc(task.description ?? "");
      setDueDate(task.dueDate ?? "");
      setPriority(task.priority ?? "MEDIUM");
    }
  }, [task]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px]">
        <SheetHeader>
          <SheetTitle>Task</SheetTitle>
        </SheetHeader>

        <div className="p-4 grid gap-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
          <div className="flex gap-2 items-center">
            <CalendarDialog
              onSelectDate={(d) =>
                setDueDate(d ? d.toISOString().slice(0, 10) : "")
              }
              trigger={<Button variant="ghost">Pick</Button>}
            />
            <Input value={dueDate} readOnly />
          </div>

          <div>
            <Select
              onValueChange={(v) => setPriority(v as any)}
              defaultValue={priority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex justify-between gap-2 p-4">
          <Button
            variant="destructive"
            onClick={() => {
              onDelete?.();
            }}>
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                onSave?.({ title, description: desc, dueDate, priority });
                onOpenChange(false);
              }}>
              Save
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
