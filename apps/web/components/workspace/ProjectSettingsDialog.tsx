"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Settings } from "lucide-react";

export interface ProjectSettingsProps {
  project: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    status: string;
    priority: string;
    workspaceId: string;
  };

  onUpdated?: (updated: any) => void;
  onDeleted?: (projectId: string) => void;
  children: React.ReactNode;
  disable: boolean;
}

export function ProjectSettingsDialog({
  project,
  onUpdated,
  onDeleted,
  children,
  disable = true,
}: ProjectSettingsProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(project.name);
  const [slug, setSlug] = useState(project.slug);
  const [description, setDescription] = useState(project.description || "");
  const [status, setStatus] = useState(project.status);
  const [priority, setPriority] = useState(project.priority);

  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  const autoSlug = () => setSlug(slugify(name));

  async function saveChanges() {
    setLoading(true);
    try {
      const res = await axios.patch(
        `/project/${project.id}`,
        {
          name,
          slug,
          description,
          status,
          priority,
        },
        { withCredentials: true }
      );

      toast.success("Project updated");
      onUpdated?.(res.data);
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not update project");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject() {
    if (deleteConfirm !== project.name) {
      toast.error("Project name does not match");
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/project/${project.id}`, { withCredentials: true });

      toast.success("Project deleted");
      onDeleted?.(project.id);
      setOpen(false);
    } catch (err: any) {
      toast.error("Could not delete project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild draggable={true} disabled={disable}>
        {children ? (
          children
        ) : (
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      {/* Dialog */}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Name */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Slug */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Slug</label>
            <div className="flex gap-2">
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
              <Button variant="outline" onClick={autoSlug}>
                Auto
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="grid gap-1 ">
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="isActive">Active</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="grid gap-1">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Delete Section */}
          <div className="border rounded-md p-4 space-y-3 bg-red-50 dark:bg-red-900/20">
            <h4 className="text-sm font-semibold text-red-600 dark:text-red-400">
              Danger Zone
            </h4>

            <p className="text-xs text-muted-foreground">
              This action cannot be undone. Type the project name to confirm.
            </p>

            <Input
              placeholder={project.name}
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="bg-white dark:bg-background"
            />

            <Button
              variant="destructive"
              onClick={deleteProject}
              disabled={loading}
              className="w-full">
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete Project
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}>
            Cancel
          </Button>
          <Button onClick={saveChanges} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
