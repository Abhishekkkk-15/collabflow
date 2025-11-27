import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function ProjectMeta({ project }: any) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div>
        <Label>Status</Label>
        <Badge variant="outline" className="mt-1">
          {project?.status}
        </Badge>
      </div>

      <div>
        <Label>Priority</Label>
        <Badge variant="secondary" className="mt-1">
          {project?.priority}
        </Badge>
      </div>

      <div>
        <Label>Workspace</Label>
        <p className="mt-1 text-sm text-muted-foreground">
          {project?.workspaceName}
        </p>
      </div>
    </div>
  );
}
