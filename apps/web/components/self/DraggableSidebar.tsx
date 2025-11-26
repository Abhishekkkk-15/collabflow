"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export function SidebarSheet() {
  return (
    <Sheet>
      {/* Trigger Button */}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      {/* Right Slide-In Panel */}
      <SheetContent side="right" className="w-[380px] sm:w-[420px] p-6">
        <SheetHeader>
          <SheetTitle>Workspace Settings</SheetTitle>
          <SheetDescription>
            Manage this workspace’s details, members, permissions, and more.
          </SheetDescription>
        </SheetHeader>

        {/* Your Content Here */}
        <div className="mt-6 space-y-4">
          <Button className="w-full" variant="outline">
            Invite Members
          </Button>
          <Button className="w-full" variant="outline">
            Manage Roles
          </Button>
          <Button className="w-full" variant="outline">
            Workspace Preferences
          </Button>
          <Button className="w-full" variant="destructive">
            Delete Workspace
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
