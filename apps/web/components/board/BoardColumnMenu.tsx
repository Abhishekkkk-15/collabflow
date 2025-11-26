"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BoardColumnMenu({
  column,
  onRename,
  onDelete,
  onColor,
}: {
  column: any;
  onRename: (title: string) => void;
  onDelete: () => void;
  onColor: (color: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {!editing ? (
          <>
            <DropdownMenuItem onSelect={() => setEditing(true)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDelete()}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onColor("#ef4444")}>
              Red
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onColor("#f97316")}>
              Orange
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onColor("#10b981")}>
              Green
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  onRename(title);
                  setEditing(false);
                }}>
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
