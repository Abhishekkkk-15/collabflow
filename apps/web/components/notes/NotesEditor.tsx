"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  EditorContent,
  useEditor,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Details from "@tiptap/extension-details";
import DetailsContent from "@tiptap/extension-details-content";
import DetailsSummary from "@tiptap/extension-details-summary";
import DragHandle from "@tiptap/extension-drag-handle";
import Callout from "./extensions/Callout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

let lowlight = createLowlight(common);
lowlight.register("javascript", javascript);
lowlight.register("json", json);

function debounce<T extends (...args: any[]) => any>(fn: T, wait = 400) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

const TEMPLATES = [
  {
    id: "meeting-notes",
    title: "Meeting notes",
    description: "Meeting date, attendees, agenda and action items",
    content:
      "<h2>Meeting Notes</h2><p><strong>Date:</strong> </p><h3>Agenda</h3><ul><li>Item</li></ul><h3>Action items</h3><ul><li>[ ] Action</li></ul>",
  },
  // ...other templates
];

export default function NotesEditor({
  storageKey = "notes:local",
  initialTitle = "Untitled note",
}: {
  storageKey?: string;
  initialTitle?: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: { depth: 100 },
      }),

      Placeholder.configure({
        placeholder: "Type / for commands — e.g. /todo /table /callout",
      }),

      Link.configure({ openOnClick: true }),
      Image.configure({ inline: false }),

      TaskList,
      TaskItem,

      Underline,
      Highlight,

      CodeBlockLowlight.configure({ lowlight }),

      // Table + rows + cells
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,

      // Toggle (Details) block
      Details,
      DetailsContent,
      DetailsSummary,

      // Drag handle (simple render)
      DragHandle.configure({
        render: () => `<span class="tiptap-drag-handle" aria-hidden>⋮</span>`,
      }),

      // Custom callout block
      Callout,
    ],
    content: "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none dark:prose-invert px-1 py-2",
      },
    },
  });

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw && editor) {
        const parsed = JSON.parse(raw);
        if (parsed?.title) setTitle(parsed.title);
        if (parsed?.content) editor.commands.setContent(parsed.content);
      }
    } catch (e) {
      console.warn("Failed to load note", e);
    }
  }, [editor, storageKey]);

  const saveToStorage = useMemo(
    () =>
      debounce(() => {
        if (!editor) return;
        setIsSaving(true);
        const payload = {
          title,
          content: editor.getJSON(),
          html: editor.getHTML(),
          updatedAt: new Date().toISOString(),
        };
        try {
          localStorage.setItem(storageKey, JSON.stringify(payload));
        } catch (e) {
          console.warn("save failed", e);
        } finally {
          setIsSaving(false);
        }
      }, 600),
    [editor, title, storageKey]
  );

  useEffect(() => {
    if (!editor) return;
    const handler = () => saveToStorage();
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, saveToStorage]);

  const insertTemplate = useCallback(
    (id: string) => {
      const tpl = TEMPLATES.find((t) => t.id === id);
      if (!tpl || !editor) return;
      setTitle(tpl.title);
      editor.chain().focus().setContent(tpl.content).run();
      saveToStorage();
    },
    [editor, saveToStorage]
  );

  if (!editor) return null;

  /* Slash menu content builder (grouped) */
  const SlashMenu = () => {
    const { state } = editor;
    const { from } = state.selection;
    const textBefore = state.doc.textBetween(
      Math.max(0, from - 20),
      from,
      "\n",
      " "
    );
    const show = textBefore.endsWith("/");
    if (!show) return null;

    const blocks = [
      {
        id: "h1",
        label: "Heading 1",
        run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        id: "h2",
        label: "Heading 2",
        run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        id: "todo",
        label: "To-do",
        run: () => editor.chain().focus().toggleTaskList().run(),
      },
      {
        id: "callout",
        label: "Callout",
        run: () => editor.chain().focus().toggleCallout?.().run(),
      },
      {
        id: "table",
        label: "Table",
        run: () =>
          editor.chain().focus().insertTable?.({ rows: 2, cols: 3 }).run(),
      },
      {
        id: "code",
        label: "Code block",
        run: () => editor.chain().focus().toggleCodeBlock().run(),
      },
      {
        id: "quote",
        label: "Quote",
        run: () => editor.chain().focus().toggleBlockquote().run(),
      },
      {
        id: "divider",
        label: "Divider",
        run: () => editor.chain().focus().setHorizontalRule().run(),
      },
    ];

    return (
      <FloatingMenu
        editor={editor}
        tippyOptions={{ placement: "bottom-start" }}>
        <div className="w-64 rounded-md border bg-popover p-2 shadow">
          <div className="text-xs font-semibold px-1 pb-1">Insert</div>
          {blocks.map((b) => (
            <button
              key={b.id}
              onClick={(e) => {
                e.preventDefault();
                b.run();
              }}
              className="w-full text-left px-2 py-2 rounded hover:bg-muted flex items-center gap-2">
              <span className="text-sm">{b.label}</span>
            </button>
          ))}
        </div>
      </FloatingMenu>
    );
  };

  const Bubble = () => (
    <BubbleMenu
      editor={editor}
      className="flex gap-1 p-1 rounded bg-popover border shadow"
      tippyOptions={{ duration: 100 }}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "px-2 py-1 rounded",
          editor.isActive("bold")
            ? "bg-accent text-accent-foreground"
            : "hover:bg-muted"
        )}>
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "px-2 py-1 rounded",
          editor.isActive("italic")
            ? "bg-accent text-accent-foreground"
            : "hover:bg-muted"
        )}>
        <em>I</em>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className="px-2 py-1 rounded hover:bg-muted">
        {"</>"}
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className="px-2 py-1 rounded hover:bg-muted">
        S
      </button>
    </BubbleMenu>
  );

  return (
    <div className="flex gap-4">
      <div className="flex-1 rounded border overflow-hidden bg-card">
        <div className="flex items-center gap-3 p-3 border-b">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" onClick={() => saveToStorage()}>
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              editor.commands.clearContent(true);
              setTitle("Untitled note");
              localStorage.removeItem(storageKey);
            }}>
            Clear
          </Button>
        </div>

        <div className="p-4">
          <Bubble />
          <SlashMenu />
          <EditorContent editor={editor} />
        </div>
      </div>

      <aside className="w-64 border-l p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Templates</div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              /* toggle templates UI */
            }}>
            Templates
          </Button>
        </div>
        {TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="p-2 rounded hover:bg-muted/50 cursor-pointer"
            onClick={() => insertTemplate(tpl.id)}>
            {tpl.title}
          </div>
        ))}
        <Separator />
        <div className="text-xs text-muted-foreground">
          Autosave: {isSaving ? "saving..." : "saved"}
        </div>
      </aside>
    </div>
  );
}
