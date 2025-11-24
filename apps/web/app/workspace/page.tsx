"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InviteMembers } from "@/components/self/InviteMembers";
import type { WorkspaceRole } from "@collabflow/types";

import axios from "axios";
import { WorkspaceMember } from "@prisma/client";
export default function page() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<
    {
      userId: string;
      role: WorkspaceRole;
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
      if (!name) {
        setLoading(false);
        return;
      }
      const res = await axios.post(
        "http://localhost:3001/workspace",
        {
          ...payload,
        },
        {
          withCredentials: true,
        }
      );
      setLoading(false);
      console.log("Workspace Created:", res);
    } catch (error) {
      setLoading(false);
      console.log(error);
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
        {/* Workspace Name */}
        <div className="grid gap-2">
          <Label>Name</Label>
          <Input
            placeholder="Acme Workspace"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Slug */}
        <div className="grid gap-2">
          <Label>Slug</Label>
          <Input
            placeholder="acme-workspace"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="grid gap-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Describe what this workspace is about..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Invite Members */}
        <div className="grid gap-2">
          <Label>Invite Members</Label>
          <InviteMembers onChange={(val) => setMembers(val)} />
        </div>

        {/* Submit */}
        <div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Workspace"}
          </Button>
        </div>
      </div>
    </div>
  );
}
