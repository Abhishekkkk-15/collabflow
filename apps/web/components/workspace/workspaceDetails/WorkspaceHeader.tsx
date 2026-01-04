"use client";

import { Separator } from "@/components/ui/separator";

interface WorkspaceHeaderProps {
  workspace: any;
  memberCount: number;
  isRestricted: boolean;
  onOpenEdit: () => void;
  onOpenInvite: () => void;
  onOpenTransfer: () => void;
}

export default function WorkspaceHeader({
  workspace,
  memberCount,
  isRestricted,
  onOpenEdit,
  onOpenInvite,
  onOpenTransfer,
}: WorkspaceHeaderProps) {
  return (
    <section className="bg-card border rounded-xl p-5 shadow-sm/50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* Left: avatar + meta */}
        <div className="flex gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 grid place-items-center text-primary-foreground font-semibold text-xl">
            {(workspace.name || "").charAt(0).toUpperCase()}
          </div>

          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-semibold truncate">
                {workspace.name}
              </h1>
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                /{workspace.slug}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              {workspace.description || "No description yet."}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <span>Projects</span>
                <span className="font-medium text-foreground">
                  {workspace.projects?.length || 0}
                </span>
              </div>

              <Separator orientation="vertical" className="h-4" />

              <div className="flex items-center gap-1">
                <span>Members</span>
                <span className="font-medium text-foreground">
                  {memberCount || 0}
                </span>
              </div>

              {workspace.unreadCount && workspace.unreadCount > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-1">
                    <span>Unread</span>
                    <span className="font-medium text-destructive">
                      {workspace.unreadCount}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
