"use client";

import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function NotionTask({
  id,
  task,
  columnId,
  updateTask,
  removeTask,
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : undefined,
  };

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);

  useEffect(() => setValue(task.title), [task.title]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="cursor-grab"
      style={{ touchAction: "none" }}>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card
          className={`p-3 bg-background border shadow-sm ${
            isDragging ? "ring ring-primary/40" : ""
          }`}>
          {!editing ? (
            <div
              onDoubleClick={() => setEditing(true)}
              className="text-sm leading-tight">
              {task.title}
            </div>
          ) : (
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => {
                updateTask(columnId, task.id, value);
                setEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                } else if (e.key === "Escape") {
                  setValue(task.title);
                  setEditing(false);
                }
              }}
              className="w-full bg-transparent border-none focus:outline-none text-sm"
            />
          )}

          {/* simple footer for task */}
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{/* placeholder for labels/assignee */}</span>
            <div className="flex gap-2">
              <button
                className="hover:text-destructive"
                onClick={() => removeTask(columnId, task.id)}>
                Delete
              </button>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
