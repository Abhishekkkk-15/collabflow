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
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <div className="border-b border-border bg-muted px-4 py-2 flex items-center gap-1 flex-wrap">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:hover transition-colors ${
          editor.isActive("bold") ? "bg-muted" : ""
        }`}
        title="Bold (Ctrl+B)">
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:hover transition-colors ${
          editor.isActive("italic") ? "bg-muted" : ""
        }`}
        title="Italic (Ctrl+I)">
        <Italic className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:hover transition-colors ${
          editor.isActive("underline") ? "bg-muted" : ""
        }`}
        title="Underline (Ctrl+U)">
        <Underline className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:hover transition-colors ${
          editor.isActive("strike") ? "bg-muted" : ""
        }`}
        title="Strikethrough">
        <Strikethrough className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:hover transition-colors ${
          editor.isActive("code") ? "bg-muted" : ""
        }`}
        title="Inline Code">
        <Code className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-2 rounded hover:hover transition-colors ${
          editor.isActive("highlight") ? "bg-muted" : ""
        }`}
        title="Highlight">
        <Highlighter className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-accent mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:hover transition-colors ${
          editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""
        }`}
        title="Heading 1">
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:hover transition-colors ${
          editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""
        }`}
        title="Heading 2">
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:hover transition-colors ${
          editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""
        }`}
        title="Heading 3">
        <Heading3 className="w-4 h-4" />
      </button>
    </div>
  );
}
