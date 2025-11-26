"use client";

import React, { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import NotionColumn from "./NotionColumn";
import AddColumnInline from "./AddColumnInline"; // reuse earlier AddColumnInline
import { motion } from "framer-motion";

export type NTask = {
  id: string;
  title: string;
};

export type NColumn = {
  id: string;
  title: string;
  tasks: NTask[];
};

export default function NotionBoard() {
  const [columns, setColumns] = useState<NColumn[]>([
    {
      id: "todo",
      title: "Todo",
      tasks: [
        { id: "t1", title: "Create Login Page" },
        { id: "t2", title: "Fix Navbar bug" },
      ],
    },
    {
      id: "doing",
      title: "In Progress",
      tasks: [{ id: "t3", title: "Database modeling" }],
    },
    {
      id: "done",
      title: "Done",
      tasks: [{ id: "t4", title: "Setup project repo" }],
    },
  ]);

  const sensors = useSensors(useSensor(PointerSensor));

  // helper to find column index by id
  const findColumnIndex = (colId: string) =>
    columns.findIndex((c) => c.id === colId);

  const moveColumn = (oldIndex: number, newIndex: number) => {
    setColumns((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  // move task between columns or reorder within same column
  const moveTask = useCallback(
    (fromColId: string, toColId: string, taskId: string, toIndex?: number) => {
      setColumns((prev) => {
        const copy = prev.map((c) => ({ ...c, tasks: [...c.tasks] }));
        const fromCol = copy.find((c) => c.id === fromColId);
        const toCol = copy.find((c) => c.id === toColId);
        if (!fromCol || !toCol) return prev;

        const taskIndex = fromCol.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return prev;
        const [task] = fromCol.tasks.splice(taskIndex, 1);

        if (typeof toIndex === "number") toCol.tasks.splice(toIndex, 0, task);
        else toCol.tasks.push(task);

        return copy;
      });
    },
    []
  );

  function handleDragOver(event: DragOverEvent) {
    // Optional: you can implement hover preview or auto-scroll
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Column dragging (ids: "col:<colId>")
    if (activeId.startsWith("col:") && overId.startsWith("col:")) {
      const fromId = activeId.replace("col:", "");
      const toId = overId.replace("col:", "");
      const oldIndex = findColumnIndex(fromId);
      const newIndex = findColumnIndex(toId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        moveColumn(oldIndex, newIndex);
      }
      return;
    }

    // Task dragging (ids: "task:<colId>:<taskId>")
    if (activeId.startsWith("task:")) {
      const partsA = activeId.split(":");
      const fromColId = partsA[1];
      const taskId = partsA[2];

      // Dropped on column area (overId -> "col:<colId>")
      if (overId.startsWith("col:")) {
        const toColId = overId.replace("col:", "");
        moveTask(fromColId, toColId, taskId);
        return;
      }

      // Dropped on another task (overId -> "task:<colId>:<taskId>")
      if (overId.startsWith("task:")) {
        const partsB = overId.split(":");
        const toColId = partsB[1];
        const toTaskId = partsB[2];

        if (fromColId === toColId) {
          // reorder within same column
          setColumns((prev) =>
            prev.map((col) => {
              if (col.id !== fromColId) return col;
              const oldIndex = col.tasks.findIndex((t) => t.id === taskId);
              const newIndex = col.tasks.findIndex((t) => t.id === toTaskId);
              if (oldIndex === -1 || newIndex === -1) return col;
              return {
                ...col,
                tasks: arrayMove(col.tasks, oldIndex, newIndex),
              };
            })
          );
        } else {
          // move across columns, insert before toTaskId
          const toCol = columns.find((c) => c.id === toColId)!;
          const insertIndex = toCol.tasks.findIndex((t) => t.id === toTaskId);
          moveTask(fromColId, toColId, taskId, insertIndex);
        }
        return;
      }
    }
  }

  const addColumn = (title: string) => {
    setColumns((prev) => [
      ...prev,
      { id: `col_${Date.now()}`, title, tasks: [] },
    ]);
  };

  const addTask = (colId: string, title: string) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.id === colId
          ? { ...c, tasks: [...c.tasks, { id: `t_${Date.now()}`, title }] }
          : c
      )
    );
  };

  const updateTask = (colId: string, taskId: string, title: string) => {
    setColumns((prev) =>
      prev.map((c) =>
        c.id === colId
          ? {
              ...c,
              tasks: c.tasks.map((t) =>
                t.id === taskId ? { ...t, title } : t
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
    <div className="p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}>
        <SortableContext
          items={columns.map((c) => `col:${c.id}`)}
          strategy={rectSortingStrategy}>
          <motion.div
            layout
            className="flex gap-6 overflow-x-auto scrollbar-none">
            {columns.map((col) => (
              <NotionColumn
                key={col.id}
                column={col}
                addTask={addTask}
                updateTask={updateTask}
                removeTask={removeTask}
              />
            ))}

            <div className="min-w-[200px] self-start">
              <AddColumnInline onCreate={addColumn} />
            </div>
          </motion.div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
