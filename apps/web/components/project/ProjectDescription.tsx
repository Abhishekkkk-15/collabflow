import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ProjectDescription({ description, onUpdate }: any) {
  const [value, setValue] = React.useState(description || "");

  return (
    <div className="space-y-2">
      <Label>Description</Label>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Describe this project..."
      />

      <Button size="sm" onClick={() => onUpdate({ description: value })}>
        Save Description
      </Button>
    </div>
  );
}
