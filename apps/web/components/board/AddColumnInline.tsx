"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function AddColumnInline({
  onCreate,
}: {
  onCreate: (t: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  if (!open)
    return (
      <button
        className="text-sm text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(true)}>
        + Add group
      </button>
    );

  return (
    <div className="min-w-[200px] flex flex-col gap-2">
      <Input
        autoFocus
        placeholder="Group name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          if (value.trim()) onCreate(value.trim());
          setOpen(false);
          setValue("");
        }}
      />
    </div>
  );
}
