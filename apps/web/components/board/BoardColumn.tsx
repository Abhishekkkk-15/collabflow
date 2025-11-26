"use client";

import React, { useState } from "react";
import { Column, Task } from "./Board";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import BoardColumnMenu from "./BoardColumnMenu";
import AddTaskDialog from "./AddTaskDialog";

/** Props */
export default function BoardColumn({
  column,
  allColumns,
  addTask,
  updateColumn,
  removeColumn,
  updateTask,
  removeTask,
}: {
  column: Column;
  allColumns: Column[];
  addTask: (colId: string, task: Task) => void;
  updateColumn: (id: string, changes: Partial<Column>) => void;
  removeColumn: (id: string) => void;
  updateTask: (colId: string, taskId: string, changes: Partial<Task>) => void;
  removeTask: (colId: string, taskId: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-w-[300px] max-w-xs flex-shrink-0">
      <Card className="bg-card border">
        <CardHeader className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span
              className="w-2 h-6 rounded-sm"
              style={{ background: column.color || "#94a3b8" }}
            />
            <CardTitle className="text-base">{column.title}</CardTitle>
            <span className="ml-2 text-xs text-muted-foreground">
              {column.tasks.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <AddTaskDialog onCreate={(task) => addTask(column.id, task)}>
              <Button size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </AddTaskDialog>

            <BoardColumnMenu
              column={column}
              onRename={(t) => updateColumn(column.id, { title: t })}
              onDelete={() => removeColumn(column.id)}
              onColor={(c) => updateColumn(column.id, { color: c })}
            />
          </div>
        </CardHeader>

        <CardContent className="p-2">
          <div className="space-y-2">
            <SortableContext
              items={column.tasks.map((t) => `task:${column.id}:${t.id}`)}
              strategy={rectSortingStrategy}>
              {column.tasks.map((task) => (
                <SortableTask
                  key={task.id}
                  id={`task:${column.id}:${task.id}`}
                  task={task}
                  columnId={column.id}
                  updateTask={(changes) =>
                    updateTask(column.id, task.id, changes)
                  }
                  removeTask={() => removeTask(column.id, task.id)}
                />
              ))}
            </SortableContext>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
