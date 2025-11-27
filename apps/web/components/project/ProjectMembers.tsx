import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InviteMembers } from "@/components/self/InviteMembers";

export function ProjectMembers({ members, project }: any) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label>Members</Label>

        <Button size="sm" onClick={() => setOpen(true)}>
          Add Members
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {members?.map((m: any) => (
          <div
            key={m?.id}
            className="flex items-center justify-between border rounded p-2">
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage src={m?.avatar} />
                <AvatarFallback>{m?.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{m?.name}</p>
                <p className="text-xs text-muted-foreground">{m?.email}</p>
              </div>
            </div>

            <span className="text-xs bg-muted px-2 py-1 rounded">
              {m?.role}
            </span>
          </div>
        ))}
      </div>

      <InviteMembers roleType="PROJECT" workspaceId={project?.id} />
    </div>
  );
}
