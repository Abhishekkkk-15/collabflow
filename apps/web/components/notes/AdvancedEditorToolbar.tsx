"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  Image,
  Palette,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ColorPicker } from "./ColorPicker";
import { EmojiPicker } from "./EmojiPicker";

const TEXT_COLORS = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

const BG_COLORS = [
  "#fef3c7",
  "#fecaca",
  "#fca5a5",
  "#fbcfe8",
  "#ddd6fe",
  "#bfdbfe",
  "#a7f3d0",
  "#d1fae5",
  "#dbeafe",
  "#e0e7ff",
];

interface AdvancedEditorToolbarProps {
  editor: Editor;
  onLinkClick?: () => void;
  onImageClick?: () => void;
}

export function AdvancedEditorToolbar({
  editor,
  onLinkClick,
  onImageClick,
}: AdvancedEditorToolbarProps) {
  const toggleFormat = (command: () => any) => {
    command();
  };

  return (
    <TooltipProvider>
      <div className=" border-border bg-card px-4 py-3 flex items-center gap-1 flex-wrap">
        {/* Text Formatting */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive("bold") ? "default" : "ghost"}
              size="icon"
              onClick={() =>
                toggleFormat(() => editor.chain().focus().toggleBold().run())
              }>
              <Bold className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive("italic") ? "default" : "ghost"}
              size="icon"
              onClick={() =>
                toggleFormat(() => editor.chain().focus().toggleItalic().run())
              }>
              <Italic className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive("underline") ? "default" : "ghost"}
              size="icon"
              onClick={() =>
                toggleFormat(() =>
                  editor.chain().focus().toggleUnderline().run()
                )
              }>
              <Underline className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Underline</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive("strike") ? "default" : "ghost"}
              size="icon"
              onClick={() =>
                toggleFormat(() => editor.chain().focus().toggleStrike().run())
              }>
              <Strikethrough className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Strikethrough</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive("code") ? "default" : "ghost"}
              size="icon"
              onClick={() =>
                toggleFormat(() => editor.chain().focus().toggleCode().run())
              }>
              <Code className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Code</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={
                editor.isActive("heading", { level: 1 }) ? "default" : "ghost"
              }
              size="icon"
              onClick={() =>
                toggleFormat(() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                )
              }>
              <Heading1 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 1</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={
                editor.isActive("heading", { level: 2 }) ? "default" : "ghost"
              }
              size="icon"
              onClick={() =>
                toggleFormat(() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                )
              }>
              <Heading2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 2</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={
                editor.isActive("heading", { level: 3 }) ? "default" : "ghost"
              }
              size="icon"
              onClick={() =>
                toggleFormat(() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                )
              }>
              <Heading3 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 3</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Colors */}
        <Tooltip>
          <TooltipTrigger asChild>
            <ColorPicker
              label="Text Color"
              colors={TEXT_COLORS}
              onColorSelect={(color) => {
                editor.chain().focus().setColor(color).run();
              }}
              currentColor={editor.getAttributes("textStyle").color}
            />
          </TooltipTrigger>
          <TooltipContent>Text Color</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ColorPicker
              label="Background Color"
              colors={BG_COLORS}
              onColorSelect={(color) => {
                editor.chain().focus().toggleHighlight({ color }).run();
              }}
            />
          </TooltipTrigger>
          <TooltipContent>Highlight</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Links and Media */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={editor.isActive("link") ? "default" : "ghost"}
              size="icon"
              onClick={onLinkClick}>
              <Link2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Link</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onImageClick}>
              <Image className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Image</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Emoji */}
        <EmojiPicker
          onEmojiSelect={(emoji) => {
            editor.chain().focus().insertContent(emoji).run();
          }}
        />
      </div>
    </TooltipProvider>
  );
}
