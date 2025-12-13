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
  Minus,
  Image,
  Link2,
} from "lucide-react";

interface AdvancedSlashMenuProps {
  editor: Editor;
  position: { top: number; left: number };
  onClose: () => void;
  onLinkClick?: () => void;
  onImageClick?: () => void;
}

interface Command {
  title: string;
  icon: React.ElementType;
  command: () => void;
  description: string;
  category: string;
}

export function AdvancedSlashMenu({
  editor,
  position,
  onClose,
  onLinkClick,
  onImageClick,
}: AdvancedSlashMenuProps) {
  const commands: Command[] = [
    {
      category: "Text",
      title: "Paragraph",
      icon: Type,
      description: "Just start writing",
      command: () => {
        editor.chain().focus().setParagraph().run();
        onClose();
      },
    },
    {
      category: "Text",
      title: "Heading 1",
      icon: Heading1,
      description: "Large section heading",
      command: () => {
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        onClose();
      },
    },
    {
      category: "Text",
      title: "Heading 2",
      icon: Heading2,
      description: "Medium section heading",
      command: () => {
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        onClose();
      },
    },
    {
      category: "Text",
      title: "Heading 3",
      icon: Heading3,
      description: "Small section heading",
      command: () => {
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        onClose();
      },
    },
    {
      category: "Lists",
      title: "Bulleted List",
      icon: List,
      description: "Create a bulleted list",
      command: () => {
        editor.chain().focus().toggleBulletList().run();
        onClose();
      },
    },
    {
      category: "Lists",
      title: "Numbered List",
      icon: ListOrdered,
      description: "Create a numbered list",
      command: () => {
        editor.chain().focus().toggleOrderedList().run();
        onClose();
      },
    },
    {
      category: "Lists",
      title: "Todo List",
      icon: CheckSquare,
      description: "Track tasks with checkboxes",
      command: () => {
        editor.chain().focus().toggleTaskList().run();
        onClose();
      },
    },
    {
      category: "Text",
      title: "Quote",
      icon: Quote,
      description: "Capture important text",
      command: () => {
        editor.chain().focus().toggleBlockquote().run();
        onClose();
      },
    },
    {
      category: "Code",
      title: "Code Block",
      icon: Code,
      description: "Syntax-highlighted code",
      command: () => {
        editor.chain().focus().toggleCodeBlock().run();
        onClose();
      },
    },
    {
      category: "Divider",
      title: "Divider",
      icon: Minus,
      description: "Visual separator line",
      command: () => {
        editor.chain().focus().setHorizontalRule().run();
        onClose();
      },
    },
    {
      category: "Advanced",
      title: "Link",
      icon: Link2,
      description: "Add a hyperlink",
      command: () => {
        onLinkClick?.();
        onClose();
      },
    },
    {
      category: "Advanced",
      title: "Image",
      icon: Image,
      description: "Embed an image",
      command: () => {
        onImageClick?.();
        onClose();
      },
    },
  ];

  const categories = Array.from(new Set(commands.map((c) => c.category)));

  return (
    <div
      className="fixed bg-accent rounded-lg shadow-xl border border-border py-2 w-96 z-50 max-h-96 overflow-y-auto"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}>
      {categories.map((category) => (
        <div key={category}>
          <div className="px-4 py-2 text-xs text-accent-foreground font-semibold uppercase tracking-wide">
            {category}
          </div>
          {commands
            .filter((c) => c.category === category)
            .map((command) => (
              <button
                key={command.title}
                onClick={command.command}
                className="w-full flex items-start gap-3 px-4 py-2 hover:hover transition-colors text-left">
                <div className="mt-0.5 flex-shrink-0">
                  <command.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium text-foreground
 text-sm">
                    {command.title}
                  </div>
                  <div className="text-xs text-accent-foreground">
                    {command.description}
                  </div>
                </div>
              </button>
            ))}
        </div>
      ))}
    </div>
  );
}
