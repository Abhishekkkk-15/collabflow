"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface LinkDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (url: string, text: string) => void;
  initialUrl?: string;
  initialText?: string;
}

export function LinkDialog({
  open,
  onClose,
  onSave,
  initialUrl = "",
  initialText = "",
}: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);

  const handleSave = () => {
    if (url.trim()) {
      onSave(url, text || url);
      setUrl("");
      setText("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">URL</label>
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium">Link Text (optional)</label>
            <Input
              placeholder="Link text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Add Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
