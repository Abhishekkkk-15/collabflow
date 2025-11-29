"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import MemberAvatarGrid from "./MemberAvatarGrid";
import { WorkspaceWithMeta } from "./WorkspaceDetails";

interface WorkspaceInfoCardProps {
  workspace: WorkspaceWithMeta;
  members: any[];
  isRestricted: boolean;
  onInviteClick: () => void;
}

export default function WorkspaceInfoCard({
  workspace,
  members,
  isRestricted,
  onInviteClick,
}: WorkspaceInfoCardProps) {
  return (
    <aside className="space-y-4">
      {/* Workspace + members */}
      <section className="bg-card border rounded-xl p-4 shadow-sm/40 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Workspace</p>
            <p className="font-semibold">{workspace.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Unread</p>
            <p className="font-medium text-destructive">
              {workspace.unreadCount || 0}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Members</p>
            {!isRestricted && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs px-2"
                onClick={onInviteClick}>
                Invite
              </Button>
            )}
          </div>
          <MemberAvatarGrid members={members || []} />
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Owner</p>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {workspace.owner?.image ? (
                <AvatarImage src={workspace.owner.image} />
              ) : (
                <AvatarFallback>
                  {workspace.owner?.name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">
                {workspace.owner?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {workspace.owner?.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-card border rounded-xl p-4 shadow-sm/40 text-sm space-y-2">
        <p className="font-medium text-sm">Quick links</p>
        <div className="flex flex-col gap-1.5">
          <Link
            href={`/dashboard/${workspace.slug}/settings`}
            className="text-muted-foreground hover:text-foreground">
            Workspace settings
          </Link>
          <Link
            href={`/dashboard/${workspace.slug}/members`}
            className="text-muted-foreground hover:text-foreground">
            Manage members
          </Link>
          <Link
            href={`/dashboard/${workspace.slug}/analytics`}
            className="text-muted-foreground hover:text-foreground">
            Analytics
          </Link>
        </div>
      </section>
    </aside>
  );
}
