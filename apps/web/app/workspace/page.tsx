"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InviteMembers } from "@/components/self/InviteMembers";
import type { ProjectRole, WorkspaceRole } from "@collabflow/types";
import { toast } from "sonner";
import axios from "axios";
import WorkspaceSchema from "@/lib/validator/WorkspaceSchema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import z from "zod";
import { ValidationAlert } from "@/components/self/ValidationAlert";
export default function page() {
  console.log("Client component");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [validationIssues, setValidationIssues] = useState<z.ZodIssue[] | null>(
    null
  );
  const [members, setMembers] = useState<
    {
      userId: string;
      role: WorkspaceRole | ProjectRole;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        name,
        slug,
        description,
        members,
      };
      console.log("Payload", payload);
      // 🔥 Zod validation
      const parsed = WorkspaceSchema.safeParse(payload);
      console.log("Parsed Data", parsed.data);
      if (!parsed.success) {
        setLoading(false);
        const issue = parsed.error.issues;
        setValidationIssues(issue);
        toast.error("Please fix validation errors", {
          position: "top-center",
          richColors: true,
        });

        return;
      }

      const dataToSend = parsed.data;

      const res = await axios.post(
        "http://localhost:3001/workspace",
        dataToSend,
        { withCredentials: true }
      );

      toast.success(`${res.data.name} Workspace created`, {
        position: "top-center",
        richColors: true,
      });
    } catch (error: any) {
      console.log(error);

      const errorMessage = error?.response?.data?.message;
      const errorDetails = error?.response?.data?.details;
      const errorStatusCode = error?.response?.data?.statusCode;

      if (errorStatusCode == 400) {
        toast.error(errorMessage, {
          position: "top-center",
          description: <AlertDescripition descripition={errorDetails} />,
          richColors: true,
        });
        return;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Workspace</h1>
        <p className="text-muted-foreground">
          Create a new workspace and invite members to collaborate.
        </p>
      </div>

      <div className="grid gap-6 bg-card border rounded-xl p-8">
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
            placeholder="Describe what this workspace is about..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Invite Members</Label>
          <InviteMembers
            onChange={(val) => setMembers(val)}
            roleType="WORKSPACE"
          />
        </div>
        {validationIssues?.length ? (
          <div>
            <ValidationAlert issues={validationIssues} />
          </div>
        ) : null}
        <div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Workspace"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AlertDescripition({ descripition }: { descripition: any[] }) {
  return (
    <Alert className="bg-transparent border-0">
      <AlertDescription>
        <ul className="list-inside list-disc">
          {descripition.map((item, index) => (
            <li key={index}>{item.message}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
