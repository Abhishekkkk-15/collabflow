"use client";

import React, { useState } from "react";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InviteMembers } from "@/components/self/InviteMembers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CalendarIcon } from "lucide-react";
import { PROJECT_ROLE_VALUES, ProjectRole } from "@collabflow/types";
import { CalendarDialog } from "@/components/self/CalendarDialog";
import { ProjectSchema } from "@/lib/validator/projectSchema";
import { ValidationAlert } from "@/components/self/ValidationAlert";

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

export default function CreateProjectPage() {
  const [dueDate, setDueDate] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [workspaceId, setWorkspaceId] = useState(""); // replace with real workspace ids
  const [priority, setPriority] = useState<ProjectInput["priority"]>("MEDIUM");
  const [status, setStatus] = useState<ProjectInput["status"]>("isActive");
  const [members, setMembers] = useState<
    { userId: string; role: ProjectRole }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [validationIssues, setValidationIssues] = useState<z.ZodIssue[] | null>(
    null
  );

  const mockWorkspaces = [
    { id: "cmidjdqcc0001wghcvxgmrcwo", name: "CollabFlow" },
    { id: "cmiemowug0001wg5o1kzetg94", name: "Testing" },
  ];

  const handleInviteChange = (selected: InviteUser[]) => {
    const normalized = selected.map((u) => ({
      userId: u.userId,
      role: (u.role as ProjectRole) ?? "member",
    }));
    setMembers(normalized);
  };

  const handleAutoSlug = () => {
    setSlug(slugify(name));
  };

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
        dueDate: dueDate,
        members: members.length ? members : undefined,
      };

      const parsed = ProjectSchema.safeParse(payload);
      if (!parsed.success) {
        setValidationIssues(parsed.error.issues);
        setLoading(false);
        toast.error("Please fix validation errors", {
          position: "top-center",
          richColors: true,
        });
        return;
      }

      const res = await axios.post(
        "http://localhost:3001/project",
        parsed.data,
        {
          withCredentials: true,
        }
      );

      toast.success(`Project "${res.data.name}" created`, {
        position: "top-center",
        richColors: true,
      });

      // optional: reset form
      setName("");
      setSlug("");
      setDescription("");
      setWorkspaceId("");
      setPriority("MEDIUM");
      setStatus("isActive");
      setMembers([]);
    } catch (err: any) {
      console.error("Create project error", err);
      const errorMessage =
        err?.response?.data?.message ?? "Failed to create project";
      const errorDetails = err?.response?.data?.details;

      if (err?.response?.status === 400 && Array.isArray(errorDetails)) {
        // show server-side validation details if provided
        toast.error(errorMessage, {
          position: "top-center",
          description: (
            <div className="max-w-sm">
              <ValidationAlert issues={errorDetails} />
            </div>
          ),
          richColors: true,
        });
        return;
      }

      toast.error(errorMessage, { position: "top-center", richColors: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Project</h1>
        <p className="text-muted-foreground">
          Create a new project inside a workspace.
        </p>
      </div>

      <div className="grid gap-6 bg-card border rounded-xl p-8">
        {/* Name + slug */}
        <div className="grid md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2 grid gap-2">
            <Label>Project Name</Label>
            <Input
              placeholder="Website Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Slug</Label>
            <div className="flex gap-2">
              <Input
                placeholder="website-redesign"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <Button variant="outline" onClick={handleAutoSlug}>
                Auto
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="grid gap-2">
          <Label>Description</Label>
          <Textarea
            placeholder="What is the project about..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label>Due Date</Label>

          <div className="relative">
            {/* Date Input */}
            <Input
              type="date"
              placeholder="dd-mm-yyyy"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="pr-10 cursor-pointer"
            />

            {/* Calendar Icon Button */}
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
        {/* workspace + priority + status */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label>Workspace</Label>
            <Select
              onValueChange={(val) => setWorkspaceId(val)}
              defaultValue={workspaceId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select workspace..." />
              </SelectTrigger>
              <SelectContent>
                {mockWorkspaces.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Priority</Label>
            <Select
              onValueChange={(val) =>
                setPriority(val as ProjectInput["priority"])
              }
              defaultValue={priority}>
              <SelectTrigger className="w-full">
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
              onValueChange={(val) => setStatus(val as ProjectInput["status"])}
              defaultValue={status}>
              <SelectTrigger className="w-full">
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
        </div>

        {/* Invite Members */}
        <div className="grid gap-2">
          <Label>Invite Members</Label>
          <InviteMembers
            onChange={(val) => handleInviteChange(val as InviteUser[])}
            roleType="PROJECT"
            slug={workspaceId}
          />
          <p className="text-xs text-muted-foreground">
            Selected: {members.length} member(s)
          </p>
        </div>

        {/* Validation issues */}
        {validationIssues?.length ? (
          <div>
            <ValidationAlert issues={validationIssues} />
          </div>
        ) : null}

        {/* Submit */}
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // optional: reset form
              setName("");
              setSlug("");
              setDescription("");
              setWorkspaceId("");
              setPriority("MEDIUM");
              setStatus("isActive");
              setMembers([]);
            }}>
            Reset
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </div>
    </div>
  );
}
