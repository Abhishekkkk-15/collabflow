"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface EditWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace: any;
  onSave: (data: {
    name: string;
    slug: string;
    description?: string;
  }) => Promise<void> | void;
  loading?: boolean;
  disabled?: boolean;
}

export default function EditWorkspaceDialog({
  open,
  onOpenChange,
  workspace,
  onSave,
  loading,
  disabled,
}: EditWorkspaceDialogProps) {
  const [name, setName] = useState(workspace.name || "");
  const [slug, setSlug] = useState(workspace.slug || "");
  const [description, setDescription] = useState(workspace.description || "");

  useEffect(() => {
    if (!open) return;
    setName(workspace.name || "");
    setSlug(workspace.slug || "");
    setDescription(workspace.description || "");
  }, [
    open,
    workspace.id,
    workspace.name,
    workspace.slug,
    workspace.description,
  ]);

  function slugify(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  async function handleSubmit() {
    if (!name.trim()) return;
    // try {
    //   const res = await api.patch("/workspace", { name, description });
    //   console.log("res", res);
    // } catch (error) {
    //   console.log(error);
    // }
    await onSave({
      name: name.trim(),
      slug: slugify(slug || name),
      description,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit workspace</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 py-2 text-sm">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={disabled || loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Slug</label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={disabled || loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={disabled || loading}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={disabled || loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
