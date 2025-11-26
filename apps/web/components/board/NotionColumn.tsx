"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import NotionTask from "./NotionTask";

export default function NotionColumn({
  column,
  addTask,
  updateTask,
  removeTask,
}: any) {
  const { id, title, tasks } = column;
  const droppableId = `col:${id}`;
  const { setNodeRef } = useDroppable({ id: droppableId });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-w-[300px]">
      <div ref={setNodeRef} className="bg-transparent">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">{title}</h3>
          <span className="text-xs text-muted-foreground">{tasks.length}</span>
        </div>

        <SortableContext
          items={tasks.map((t: any) => `task:${id}:${t.id}`)}
          strategy={rectSortingStrategy}>
          <div className="space-y-2">
            {tasks.map((task: any) => (
              <NotionTask
                key={task.id}
                id={`task:${id}:${task.id}`}
                task={task}
                columnId={id}
                updateTask={updateTask}
                removeTask={removeTask}
              />
            ))}
          </div>
        </SortableContext>

        <button
          className="mt-3 w-full text-left text-sm text-muted-foreground px-2 py-1 rounded hover:bg-muted/40"
          onClick={() => {
            const val = prompt("New card title");
            if (val) addTask(id, val);
          }}>
          + Add a card
        </button>
      </div>
    </motion.div>
  );
}
