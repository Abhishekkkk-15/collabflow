import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function ProjectDangerZone({ projectId, onDelete }: any) {
  return (
    <div className="border rounded-lg p-4 bg-red-50/50 dark:bg-red-950/20">
      <h3 className="flex items-center gap-2 font-semibold text-red-600 dark:text-red-400">
        <AlertTriangle className="size-4" />
        Danger Zone
      </h3>

      <p className="text-sm text-muted-foreground mt-1">
        Deleting this project will permanently remove tasks, chat history, and
        related data.
      </p>

      <Button
        variant="destructive"
        className="mt-4"
        onClick={() => onDelete(projectId)}>
        Delete Project
      </Button>
    </div>
  );
}
