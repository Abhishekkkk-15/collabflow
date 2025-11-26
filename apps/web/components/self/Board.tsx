"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import SortableItem from "./SortableItem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export type BoardColumn = {
  id: string;
  title: string;
  tasks: {
    id: string;
    content: string;
  }[];
};

export default function Board() {
  const [columns, setColumns] = useState<BoardColumn[]>([
    {
      id: "todo",
      title: "Todo",
      tasks: [
        { id: "1", content: "Setup project" },
        { id: "2", content: "Define schema" },
      ],
    },
    {
      id: "inprogress",
      title: "In Progress",
      tasks: [{ id: "3", content: "Building UI Components" }],
    },
    {
      id: "done",
      title: "Done",
      tasks: [{ id: "4", content: "Create workspace API" }],
    },
  ]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const [fromCol, fromTask] = active.id.split(":");
    const [toCol, toTask] = over.id.split(":");

    if (fromCol === toCol) {
      // Same column reorder
      const column = columns.find((c) => c.id === fromCol);
      if (!column) return;

      const oldIndex = column.tasks.findIndex((t) => t.id === fromTask);
      const newIndex = column.tasks.findIndex((t) => t.id === toTask);

      const updatedTasks = arrayMove(column.tasks, oldIndex, newIndex);

      setColumns((prev) =>
        prev.map((c) =>
          c.id === column.id ? { ...c, tasks: updatedTasks } : c
        )
      );
    } else {
      // Move between columns
      const fromColumn = columns.find((c) => c.id === fromCol);
      const toColumn = columns.find((c) => c.id === toCol);
      if (!fromColumn || !toColumn) return;

      const task = fromColumn.tasks.find((t) => t.id === fromTask);
      if (!task) return;

      setColumns((prev) =>
        prev.map((c) => {
          if (c.id === fromCol) {
            return { ...c, tasks: c.tasks.filter((t) => t.id !== task.id) };
          }
          if (c.id === toCol) {
            return { ...c, tasks: [...c.tasks, task] };
          }
          return c;
        })
      );
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-none p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        {columns.map((col) => (
          <Card key={col.id} className="min-w-[300px] max-w-xs">
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                {col.title}
                <Button size="sm" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ScrollArea className="h-[70vh] pr-2">
                <SortableContext
                  items={col.tasks.map((t) => `${col.id}:${t.id}`)}
                  strategy={rectSortingStrategy}>
                  <div className="flex flex-col gap-2">
                    {col.tasks.map((task) => (
                      <SortableItem
                        key={task.id}
                        id={`${col.id}:${task.id}`}
                        content={task.content}
                      />
                    ))}
                  </div>
                </SortableContext>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </DndContext>
    </div>
  );
}
