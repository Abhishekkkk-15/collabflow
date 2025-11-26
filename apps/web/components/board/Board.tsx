"use client";

import React, { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import BoardColumn from "./BoardColumn";
import AddColumnDialog from "./AddColumnDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

/**
 * Types
 */
export type Task = {
  id: string;
  title: string;
  description?: string;
  assigneeId?: string;
  labels?: string[];
  dueDate?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
};

export type Column = {
  id: string;
  title: string;
  color?: string;
  tasks: Task[];
};

/** ---------------------------
 * Board Component
 * --------------------------*/
export default function Board() {
  const [columns, setColumns] = useState<Column[]>(() =>
    // initial demo data
    [
      {
        id: "col_todo",
        title: "Todo",
        color: "#2563eb",
        tasks: [
          { id: "t1", title: "Design header", priority: "HIGH" },
          { id: "t2", title: "Create workspace API" },
        ],
      },
      {
        id: "col_inprogress",
        title: "In Progress",
        color: "#fb923c",
        tasks: [{ id: "t3", title: "Build Board component" }],
      },
      {
        id: "col_done",
        title: "Done",
        color: "#10b981",
        tasks: [{ id: "t4", title: "Setup repo" }],
      },
    ]
  );

  const sensors = useSensors(useSensor(PointerSensor));

  // Move column (by index)
  const moveColumn = useCallback((oldIndex: number, newIndex: number) => {
    setColumns((prev) => arrayMove(prev, oldIndex, newIndex));
  }, []);

  // Move task between/within columns
  const moveTask = useCallback(
    (fromColId: string, toColId: string, taskId: string, toIndex?: number) => {
      setColumns((prev) => {
        const newCols = prev.map((c) => ({ ...c, tasks: [...c.tasks] }));
        const fromCol = newCols.find((c) => c.id === fromColId)!;
        const toCol = newCols.find((c) => c.id === toColId)!;
        const taskIndex = fromCol.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return prev;

        const [task] = fromCol.tasks.splice(taskIndex, 1);
        if (toIndex === undefined) toCol.tasks.push(task);
        else toCol.tasks.splice(toIndex, 0, task);
        return newCols;
      });
    },
    []
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Column drag: ids are "col:<id>"
    if (activeId.startsWith("col:") && overId.startsWith("col:")) {
      const fromId = activeId.replace("col:", "");
      const toId = overId.replace("col:", "");
      const oldIndex = columns.findIndex((c) => c.id === fromId);
      const newIndex = columns.findIndex((c) => c.id === toId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        moveColumn(oldIndex, newIndex);
      }
      return;
    }

    // Task drag: ids are "task:<colId>:<taskId>"
    if (activeId.startsWith("task:") && overId.startsWith("task:")) {
      const [, fromColId, taskId] = activeId.split(":");
      const [, toColId, toTaskId] = overId.split(":");

      // same column reorder
      if (fromColId === toColId) {
        setColumns((prev) =>
          prev.map((col) => {
            if (col.id !== fromColId) return col;
            const oldIndex = col.tasks.findIndex((t) => t.id === taskId);
            const newIndex = col.tasks.findIndex((t) => t.id === toTaskId);
            if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex)
              return col;
            return { ...col, tasks: arrayMove(col.tasks, oldIndex, newIndex) };
          })
        );
      } else {
        // move between columns (append after target)
        const toCol = columns.find((c) => c.id === toColId)!;
        const toIndex = toCol.tasks.findIndex((t) => t.id === toTaskId);
        moveTask(fromColId, toColId, taskId, toIndex + 1);
      }

      return;
    }

    // Dropped on column area (not a specific task) — format "col:<id>"
    if (activeId.startsWith("task:") && overId.startsWith("col:")) {
      const [, fromColId, taskId] = activeId.split(":");
      const toColId = overId.replace("col:", "");
      moveTask(fromColId, toColId, taskId);
      return;
    }
  }

  // Column CRUD helpers
  const addColumn = (title: string) => {
    setColumns((prev) => [
      ...prev,
      { id: `col_${Date.now()}`, title, color: "#64748b", tasks: [] },
    ]);
  };

  const updateColumn = (id: string, changes: Partial<Column>) => {
    setColumns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...changes } : c))
    );
  };

  const removeColumn = (id: string) => {
    setColumns((prev) => prev.filter((c) => c.id !== id));
  };

  // Task CRUD helpers
  const addTask = (colId: string, task: Task) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.id === colId ? { ...c, tasks: [task, ...c.tasks] } : c
      )
    );
  };

  const updateTask = (
    colId: string,
    taskId: string,
    changes: Partial<Task>
  ) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.id === colId
          ? {
              ...c,
              tasks: c.tasks.map((t) =>
                t.id === taskId ? { ...t, ...changes } : t
              ),
            }
          : c
      )
    );
  };

  const removeTask = (colId: string, taskId: string) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.id === colId
          ? { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) }
          : c
      )
    );
  };

  return (
    <div className="p-4 flex gap-4 overflow-x-auto scrollbar-none h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        <SortableContext
          items={columns.map((c) => `col:${c.id}`)}
          strategy={rectSortingStrategy}>
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              allColumns={columns}
              addTask={addTask}
              updateColumn={updateColumn}
              removeColumn={removeColumn}
              updateTask={updateTask}
              removeTask={removeTask}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="min-w-[260px] self-start">
        <AddColumnDialog onCreate={(title) => addColumn(title)}>
          <Button className="w-full h-[48px] gap-2" variant="outline">
            <Plus className="h-4 w-4" /> Add List
          </Button>
        </AddColumnDialog>
      </div>
    </div>
  );
}
