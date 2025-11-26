"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import TaskDetailsSheet from "./TaskDetailsSheet";

export default function SortableTask({
  id,
  task,
  columnId,
  updateTask,
  removeTask,
}: {
  id: string;
  task: any;
  columnId: string;
  updateTask: (changes: any) => void;
  removeTask: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [openDetails, setOpenDetails] = useState(false);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card className="p-3 cursor-grab hover:shadow-md">
          <div className="flex justify-between items-start gap-2">
            <div className="text-sm font-medium">{task.title}</div>
            <div className="text-xs text-muted-foreground">{task.priority}</div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground truncate">
            {task.description}
          </div>
          <div className="mt-3 flex justify-end z-auto">
            <button
              className="text-xs text-muted-foreground z-50"
              onClick={() => setOpenDetails(true)}>
              Open
            </button>
          </div>
        </Card>
      </div>

      <TaskDetailsSheet
        open={openDetails}
        onOpenChange={setOpenDetails}
        task={task}
        onSave={(changes: any) => updateTask(changes)}
        onDelete={() => {
          removeTask();
          setOpenDetails(false);
        }}
      />
    </>
  );
}
