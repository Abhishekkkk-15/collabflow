"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface TransferOwnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace: any;
  members: any[];
  onTransfer: (newOwnerId: string) => Promise<void> | void;
  loading?: boolean;
  disabled?: boolean;
}

export default function TransferOwnerDialog({
  open,
  onOpenChange,
  workspace,
  members,
  onTransfer,
  loading,
  disabled,
}: TransferOwnerDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedId(null);
    }
  }, [open]);

  async function handleTransfer() {
    if (!selectedId) return;
    await onTransfer(selectedId);
  }

  const eligibleMembers =
    members?.filter((m) => m.id !== workspace.ownerId) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer ownership</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 py-2 text-sm">
          <p className="text-sm text-muted-foreground">
            Choose a new owner for this workspace.
          </p>

          <div className="max-h-[40vh] overflow-auto border rounded-md p-2 space-y-1">
            {eligibleMembers.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                No other members available.
              </p>
            )}

            {eligibleMembers.map((m: any) => (
              <label
                key={m.id}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition hover:bg-muted/40 ${
                  selectedId === m.id ? "bg-accent/40" : ""
                }`}>
                <input
                  type="radio"
                  name="newOwner"
                  className="accent-primary"
                  checked={selectedId === m.id}
                  onChange={() => setSelectedId(m.id)}
                  disabled={disabled || loading}
                />
                <Avatar className="h-8 w-8">
                  {m.user?.image ? (
                    <AvatarImage src={m.user.image} />
                  ) : (
                    <AvatarFallback>
                      {m.user?.name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">
                    {m.user?.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {m.user?.email}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={!selectedId || disabled || loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
