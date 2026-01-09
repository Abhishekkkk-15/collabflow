"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InviteMembers } from "@/components/self/InviteMembers";
import type { ProjectRole, WorkspaceRole } from "@collabflow/types";
import { toast } from "sonner";
import z from "zod";
import WorkspaceSchema from "@/lib/validator/WorkspaceSchema";
import { ValidationAlert } from "@/components/self/ValidationAlert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Priority, ProjectStatus } from "@prisma/client";
import { createWorkspace } from "@/lib/api/workspace/createWorkspace";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useAddWorkspace } from "@/lib/redux/hooks/use-workspaces";
import { addWorkspace, TWorkspace } from "@/lib/redux/slices/workspace";
import { useSession } from "next-auth/react";

export function CreateWorkspaceDialog({
  onCreate,
}: {
  onCreate: Dispatch<SetStateAction<any>>;
}) {
  const dispath = useAppDispatch();
  const router = useRouter();
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState<ProjectStatus>("DRAFT");
  const [priority, setPriority] = useState<Priority>("MEDIUM");

  const [members, setMembers] = useState<
    {
      userId: string;
      role: WorkspaceRole | ProjectRole;
      email: string;
    }[]
  >([]);

  const [validationIssues, setValidationIssues] = useState<z.ZodIssue[] | null>(
    null
  );
  function handleReset() {
    setName("");
    setSlug("");
    setDescription("");
    setMembers([]);
    setStatus("isActive");
    setPriority("MEDIUM");
  }
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        name,
        slug,
        description,
        members,
        status,
        priority,
      };

      const parsed = WorkspaceSchema.safeParse(payload);

      if (!parsed.success) {
        setValidationIssues(parsed.error.issues);
        toast.error("Please fix validation errors");
        return;
      }

      const res = await createWorkspace(parsed.data);

      toast.success(`${parsed.data.name} workspace created`);
      const user = session.data?.user!;

      const newWs = {
        id: String(Math.random()),
        name: payload.name,
        owner: {
          id: user.id,
          email: user.email!,
          image: user.image!,
          name: user.name!,
        },
        ownerId: user?.id!,
        projects: [],
        slug: res.data,
      };

      console.log(newWs);
      onCreate((prev: any) => [
        ...prev,
        {
          id: String(Math.random()),
          name: payload.name,
          owner: {
            id: user.id,
            email: user.email!,
            image: user.image!,
            name: user.name!,
          },
          ownerId: user?.id!,
          projects: [],
          slug: res.data,
        },
      ]);

      setTimeout(() => {
        setOpen(false);
        handleReset();
        router.push(`/workspace/${res.data}`);
      }, 1000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-sm p-1 text-muted-foreground hover:text-foreground hover:bg-muted">
          <Plus className="h-4 w-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            Create a workspace and invite your team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              placeholder="Acme Workspace"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Slug</Label>
            <Input
              placeholder="acme-workspace"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe your workspace..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2 w-full">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as ProjectStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {["DRAFT", "isActive", "PAUSED", "COMPLETED", "ARCHIVED"].map(
                    (s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {["LOW", "MEDIUM", "HIGH"].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Invite members</Label>
            <InviteMembers onChange={setMembers} roleType="WORKSPACE" slug="" />
          </div>

          {validationIssues?.length ? (
            <ValidationAlert issues={validationIssues} />
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create workspace"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
