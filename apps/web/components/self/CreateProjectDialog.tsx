"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { InviteMembers } from "@/components/self/InviteMembers";

import { ProjectRole } from "@collabflow/types";
import { ProjectSchema } from "@/lib/validator/projectSchema";
import { CalendarDialog } from "./CalendarDialog";
import { ValidationAlert } from "./ValidationAlert";
import { useParams } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { normalizeString } from "@/lib/slugToTitle";
import { TWorkspace } from "@/lib/redux/slices/workspace";
import { useSelector } from "react-redux";
import { api } from "@/lib/api/api";

type ProjectInput = z.infer<typeof ProjectSchema>;

type InviteUser = {
  userId: string;
  role?: ProjectRole;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[\s\_]+/g, "-")
    .replace(/[^a-z0-9\-]+/g, "")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "");
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  workspaceId: initialWorkspaceId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  workspaceId?: string;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const { workspace } = useParams();
  const [workspaceId, setWorkspaceId] = useState<string>(
    normalizeString(workspace as string) || ""
  );
  const [priority, setPriority] = useState<ProjectInput["priority"]>("MEDIUM");
  const [status, setStatus] = useState<ProjectInput["status"]>("isActive");
  const [dueDate, setDueDate] = useState("");

  const [members, setMembers] = useState<
    { userId: string; role: ProjectRole }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [validationIssues, setValidationIssues] = useState<z.ZodIssue[] | null>(
    null
  );
  console.log("init", normalizeString(initialWorkspaceId!));
  // const [userWorkspaces, setUserWorkspaces] = useState<
  //   Pick<TWorkspace, "id" | "name" | "slug">[]
  // >([]);

  const {
    workspaces: userWorkspaces,
    activeWorkspaceId,
  }: { workspaces: TWorkspace[]; activeWorkspaceId: string | null } =
    useSelector((state: any) => state.workspace);

  const handleInviteChange = (selected: InviteUser[]) => {
    const normalized = selected.map((u) => ({
      userId: u.userId,
      role: (u.role as ProjectRole) ?? "member",
    }));
    setMembers(normalized);
  };

  useEffect(() => {
    if (workspace) {
      setWorkspaceId(normalizeString(workspace as string));
      // setUserWorkspaces((prev) => {
      //   return [
      //     {
      //       id: initialWorkspaceId,
      //       name: normalizeString(initialWorkspaceId!),
      //       slug:
      //     },
      //     ...prev,
      //   ];
      // });
    }
    return () => {
      setWorkspaceId("");
    };
  }, [workspace]);
  const handleAutoSlug = () => setSlug(slugify(name));

  const handleSubmit = async () => {
    setValidationIssues(null);

    try {
      setLoading(true);

      const payload: ProjectInput = {
        name,
        slug,
        description: description || undefined,
        workspaceId,
        priority,
        status,
        dueDate: dueDate || undefined,
        members: members.length ? members : undefined,
      };

      const parsed = ProjectSchema.safeParse(payload);

      if (!parsed.success) {
        setValidationIssues(parsed.error.issues);
        setLoading(false);
        toast.error("Please correct the errors.", {
          position: "top-center",
          richColors: true,
          duration: 3000,
        });
        return;
      }

      const res = await api.post("/project", parsed.data, {
        withCredentials: true,
      });

      toast.success(`Project "${res.data.name}" created`);

      onOpenChange(false);
      setName("");
      setSlug("");
      setDescription("");
      setWorkspaceId(initialWorkspaceId || "");
      setPriority("MEDIUM");
      setStatus("isActive");
      setDueDate("");
      setMembers([]);
    } catch (err: any) {
      console.error("Create project error", err);
      const msg = err?.response?.data?.message ?? "Failed to create project";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl hide-scrollbar">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Add a new project to this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 max-h-[75vh] overflow-y-auto  hide-scrollbar">
          <div className="grid gap-2">
            <Label>Project Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Slug</Label>
            <div className="flex gap-2">
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
              <Button variant="outline" onClick={handleAutoSlug}>
                Auto
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-2  ">
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select
                onValueChange={(v) => setPriority(v as any)}
                defaultValue={priority}>
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

            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                onValueChange={(v) => setStatus(v as any)}
                defaultValue={status}>
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
            <div className="grid gap-2">
              <Label>Workspace</Label>
              <Select onValueChange={setWorkspaceId}>
                <SelectTrigger className="w-auto">
                  <SelectValue
                    // placeholder={mockWorkspaces[0].name}
                    defaultChecked={false}
                    defaultValue={normalizeString(initialWorkspaceId!)}
                  />
                </SelectTrigger>
                <SelectContent
                  defaultChecked={false}
                  defaultValue={normalizeString(initialWorkspaceId!)}>
                  {userWorkspaces?.map((ws) => (
                    <SelectItem key={ws.id} value={ws.id}>
                      {ws.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Due Date</Label>

            <div className="relative">
              <Input
                type="date"
                placeholder="dd-mm-yyyy"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="pr-10 cursor-pointer"
              />

              <CalendarDialog
                onSelectDate={(d) =>
                  setDueDate(d?.toISOString().slice(0, 10) ?? "")
                }
                trigger={
                  <button
                    type="button"
                    className="
            absolute right-2 top-1/2 -translate-y-1/2
            text-muted-foreground hover:text-foreground
            transition
          ">
                    <CalendarIcon className="h-5 w-5" />
                  </button>
                }
              />
            </div>
          </div>
          <div className="grid gap-2 pb-2">
            <Label>Invite Members</Label>
            <InviteMembers
              onChange={(val) => handleInviteChange(val as InviteUser[])}
              roleType="PROJECT"
              slug={workspace?.toString()!}
            />
          </div>

          {validationIssues && <ValidationAlert issues={validationIssues} />}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
