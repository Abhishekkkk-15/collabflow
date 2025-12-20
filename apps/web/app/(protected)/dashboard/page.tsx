"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, Trash2, Plus } from "lucide-react";

export default function WorkspaceDashboard() {
  const [workspace, setWorkspace] = useState({
    name: "Collabflow Workspace",
    slug: "collabflow",
    description: "Private collaborative workspace",
    isPrivate: true,
  });

  return (
    <div className="min-h-screen bg-muted/40 px-4 py-6 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Workspace Settings</h1>
          <p className="text-sm text-muted-foreground">
            Control workspace identity, members, and permissions
          </p>
        </div>
        <Button className="gap-2 self-start sm:self-auto">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:w-fit sm:grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="danger">Danger</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Workspace Information</CardTitle>
              <CardDescription>
                Basic details used across Collabflow
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={workspace.name}
                    onChange={(e) =>
                      setWorkspace({ ...workspace, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    value={workspace.slug}
                    onChange={(e) =>
                      setWorkspace({ ...workspace, slug: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  className="resize-none"
                  value={workspace.description}
                  onChange={(e) =>
                    setWorkspace({ ...workspace, description: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                <div className="space-y-0.5">
                  <p className="font-medium">Private workspace</p>
                  <p className="text-sm text-muted-foreground">
                    Only invited members can access
                  </p>
                </div>
                <Switch
                  checked={workspace.isPrivate}
                  onCheckedChange={(v) =>
                    setWorkspace({ ...workspace, isPrivate: v })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members */}
        <TabsContent value="members">
          <Card className="max-w-3xl">
            <CardHeader className="flex-row reminder">
              <div className="flex-1">
                <CardTitle>Members</CardTitle>
                <CardDescription>
                  Manage who has access to this workspace
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" /> Invite
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Abhishek", "Teammate"].map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-lg border bg-background p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <p className="font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">
                        {name === "Abhishek" ? "Workspace Owner" : "Member"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={name === "Abhishek" ? "default" : "secondary"}
                  >
                    {name === "Abhishek" ? "Owner" : "Member"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions */}
        <TabsContent value="permissions">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Control what members can do inside this workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Create projects</p>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="font-medium">Invite new members</p>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger */}
        <TabsContent value="danger">
          <Card className="max-w-3xl border-destructive/40">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm text-muted-foreground">
                  Deleting this workspace will permanently remove all projects,
                  members, and data.
                </p>
              </div>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" /> Delete Workspace
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
