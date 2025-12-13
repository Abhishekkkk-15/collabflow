"use client";

import { Editor } from "@tiptap/react";
import {
  Type,
  ListOrdered,
  List,
  CheckSquare,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
} from "lucide-react";

interface SlashCommandMenuProps {
  editor: Editor;
  position: { top: number; left: number };
  onClose: () => void;
}

interface Command {
  title: string;
  icon: React.ElementType;
  command: () => void;
  description: string;
}

export function SlashCommandMenu({
  editor,
  position,
  onClose,
}: SlashCommandMenuProps) {
  const commands: Command[] = [
    {
      title: "Text",
      icon: Type,
      description: "Just start writing with plain text",
      command: () => {
        editor.chain().focus().setParagraph().run();
        onClose();
      },
    },
    {
      title: "Heading 1",
      icon: Heading1,
      description: "Big section heading",
      command: () => {
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        onClose();
      },
    },
    {
      title: "Heading 2",
      icon: Heading2,
      description: "Medium section heading",
      command: () => {
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        onClose();
      },
    },
    {
      title: "Heading 3",
      icon: Heading3,
      description: "Small section heading",
      command: () => {
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        onClose();
      },
    },
    {
      title: "Bulleted List",
      icon: List,
      description: "Create a simple bulleted list",
      command: () => {
        editor.chain().focus().toggleBulletList().run();
        onClose();
      },
    },
    {
      title: "Numbered List",
      icon: ListOrdered,
      description: "Create a list with numbering",
      command: () => {
        editor.chain().focus().toggleOrderedList().run();
        onClose();
      },
    },
    {
      title: "Todo List",
      icon: CheckSquare,
      description: "Track tasks with a todo list",
      command: () => {
        editor.chain().focus().toggleTaskList().run();
        onClose();
      },
    },
    {
      title: "Quote",
      icon: Quote,
      description: "Capture a quote",
      command: () => {
        editor.chain().focus().toggleBlockquote().run();
        onClose();
      },
    },
    {
      title: "Code Block",
      icon: Code,
      description: "Capture a code snippet",
      command: () => {
        editor.chain().focus().toggleCodeBlock().run();
        onClose();
      },
    },
  ];

  return (
    <div
      className="fixed bg-background rounded-lg shadow-lg border border-border py-2 w-80 z-50"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}>
      <div className="px-3 py-2 text-xs text-accent-foreground font-semibold uppercase">
        Basic Blocks
      </div>
      {commands.map((command) => (
        <button
          key={command.title}
          onClick={command.command}
          className="w-full flex items-start gap-3 px-3 py-2 hover:hover transition-colors text-left">
          <div className="mt-0.5">
            <command.icon className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-accent-foreground text-sm">
              {command.title}
            </div>
            <div className="text-xs text-muted-foreground">
              {command.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
