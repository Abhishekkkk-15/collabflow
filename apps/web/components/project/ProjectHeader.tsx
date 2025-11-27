import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProjectHeader({ project, onUpdate }: any) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">{project?.name}</h2>
        <p className="text-muted-foreground text-sm">/{project?.slug}</p>
      </div>

      <Button onClick={() => onUpdate(project.id)}>Edit</Button>
    </div>
  );
}
