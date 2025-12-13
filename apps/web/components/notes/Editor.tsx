"use client";
import {
  useEditor,
  EditorContent,
  Extension,
  ReactRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { useState, useEffect } from "react";
import { AdvancedSlashMenu } from "./AdvancedSlashMenu";
import { AdvancedEditorToolbar } from "./AdvancedEditorToolbar";
import { LinkDialog } from "./LinkDialog";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CodeBlockNodeView } from "./CodeBlockNodeView";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import go from "highlight.js/lib/languages/go";
import "highlight.js/styles/github.css";
import { MentionExtension } from "./extensions/MentionExtension";
import { MentionHoverCard } from "./extensions/MentionHoverCard";
import tippy from "tippy.js";

const AutoLinkOnSpace = Extension.create({
  addKeyboardShortcuts() {
    return {
      Space: () => {
        const { state, commands } = this.editor;
        const { from } = state.selection;
        const textBefore = state.doc.textBetween(
          Math.max(0, from - 200),
          from,
          " "
        );

        const match = textBefore.match(/(https?:\/\/[^\s]+)$/);

        if (!match) return false;

        const url = match[1];

        commands
          .deleteRange({
            from: from - url.length,
            to: from,
          })
          .insertContent({
            type: "text",
            text: url,
            marks: [
              {
                type: "link",
                attrs: { href: url },
              },
            ],
          });

        return false;
      },
    };
  },
});
const CustomCodeBlockLowlight = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockNodeView);
  },
});
interface EditorProps {
  content: any;
  onChange: (content: any) => void;
  onTitleChange: (title: string) => void;
  title: string;
}

export function Editor({
  content,
  onChange,
  onTitleChange,
  title,
}: EditorProps) {
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const lowlight = createLowlight();
  lowlight.register("js", javascript);
  lowlight.register("javascript", javascript);
  lowlight.register("ts", typescript);
  lowlight.register("typescript", typescript);
  lowlight.register("json", json);
  lowlight.register("css", css);
  lowlight.register("html", html);
  lowlight.register("xml", html);
  lowlight.register("python", python);
  lowlight.register("bash", bash);
  lowlight.register("go", go);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      CustomCodeBlockLowlight.configure({ lowlight }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Heading";
          }
          return "Type '/' for commands...";
        },
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Typography,
      MentionExtension,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
      AutoLinkOnSpace,
      Image.configure({
        allowBase64: true,
      }),

      Color,
      TextStyle,
    ],
    content: content,
    editorProps: {
      handleDOMEvents: {
        keydown: (view, event) => {
          const { state } = view;
          const { $from } = state.selection;

          const isInCodeBlock = $from.parent.type.name === "codeBlock";

          if (event.key === "/" && !isInCodeBlock) {
            const coords = view.coordsAtPos(state.selection.from);

            setMenuPosition({
              top: coords.top + 25,
              left: coords.left,
            });

            setShowSlashMenu(true);
            event.preventDefault();
            return true; // IMPORTANT
          }

          return false; // allow ProseMirror to continue
        },
      },
      attributes: {
        class: "focus:outline-none max-w-none px-16 py-12 tiptap-editor",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  // useEffect(() => {
  //   if (!editor) return;

  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (!editor) return;

  //     const { state } = editor;
  //     const { $from } = state.selection;

  //     const isInCodeBlock = $from.parent.type.name === "codeBlock";

  //     if (event.key === "/" && !showSlashMenu && !isInCodeBlock) {
  //       const coords = editor.view.coordsAtPos(state.selection.from);

  //       setMenuPosition({
  //         top: coords.top + 25,
  //         left: coords.left,
  //       });

  //       setShowSlashMenu(true);
  //       event.preventDefault();
  //     }

  //     if (event.key === "Escape" && showSlashMenu) {
  //       setShowSlashMenu(false);
  //     }
  //   };

  //   const editorElement = editor.view.dom;
  //   editorElement.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     editorElement.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [editor, showSlashMenu]);

  // useEffect(() => {
  //   if (editor && content !== editor.getJSON()) {
  //     editor.commands.setContent(content);
  //   }
  // }, [content, editor]);
  useEffect(() => {
    if (!editor) return;

    const editorEl = editor.view.dom;

    let popup: any = null;
    let renderer: ReactRenderer | null = null;
    let currentTarget: HTMLElement | null = null;
    let closeTimeout: number | null = null;

    const OPEN_DELAY = 300;
    const CLOSE_DELAY = 600; // 👈 THIS is the key

    const clearCloseTimeout = () => {
      if (closeTimeout) {
        window.clearTimeout(closeTimeout);
        closeTimeout = null;
      }
    };

    const destroyPopup = () => {
      popup?.destroy();
      renderer?.destroy();
      popup = null;
      renderer = null;
      currentTarget = null;
    };

    const scheduleClose = () => {
      clearCloseTimeout();
      closeTimeout = window.setTimeout(() => {
        destroyPopup();
      }, CLOSE_DELAY);
    };

    const handleMouseEnter = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest(
        ".mention"
      ) as HTMLElement;
      if (!target || currentTarget === target) return;

      clearCloseTimeout();
      destroyPopup();

      currentTarget = target;

      const id = target.dataset.id!;
      const label = target.dataset.label!;
      const avatar = target.dataset.avatar!;

      renderer = new ReactRenderer(MentionHoverCard, {
        props: { id, label, avatar },
        editor,
      });

      popup = tippy(target, {
        content: renderer.element,
        interactive: true,
        trigger: "manual",
        placement: "top",
        appendTo: () => document.body,
        delay: [OPEN_DELAY, 0],
        interactiveBorder: 16,
        hideOnClick: false,
      });

      popup.show();
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const related = event.relatedTarget as HTMLElement | null;

      if (
        related &&
        (currentTarget?.contains(related) || popup?.popper?.contains(related))
      ) {
        return;
      }

      scheduleClose();
    };

    editorEl.addEventListener("mouseenter", handleMouseEnter, true);
    editorEl.addEventListener("mouseleave", handleMouseLeave, true);

    return () => {
      clearCloseTimeout();
      destroyPopup();
      editorEl.removeEventListener("mouseenter", handleMouseEnter, true);
      editorEl.removeEventListener("mouseleave", handleMouseLeave, true);
    };
  }, [editor]);
  function normalizeUrl(url: string) {
    if (!url) return "";

    // trim whitespace
    let normalized = url.trim();

    // add protocol if missing
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = "https://" + normalized;
    }

    return normalized;
  }
  const handleAddLink = (url: string, text?: string) => {
    if (!editor) return;
    editor;
    const href = normalizeUrl(url);
    const label = text || url;

    editor
      .chain()
      .focus()
      .insertContent({
        type: "text",
        text: label,
        marks: [
          {
            type: "link",
            attrs: {
              href: url,
              title: url,
              target: "_blank",
              rel: "noopener noreferrer",
            },
          },
        ],
      })
      .run();
  };

  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file && editor) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          editor.chain().focus().setImage({ src: event.target.result }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <AdvancedEditorToolbar
        editor={editor}
        onLinkClick={() => setShowLinkDialog(true)}
        onImageClick={handleAddImage}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-16 pt-12 pb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled"
            className="text-4xl font-bold w-full focus:outline-none mb-4 border-none"
          />
        </div>

        <EditorContent editor={editor} />
      </div>

      {showSlashMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSlashMenu(false)}
          />
          <AdvancedSlashMenu
            editor={editor}
            position={menuPosition}
            onClose={() => setShowSlashMenu(false)}
            onLinkClick={() => {
              setShowLinkDialog(true);
              setShowSlashMenu(false);
            }}
            onImageClick={() => {
              handleAddImage();
              setShowSlashMenu(false);
            }}
          />
        </>
      )}

      <LinkDialog
        open={showLinkDialog}
        onClose={() => setShowLinkDialog(false)}
        onSave={handleAddLink}
      />
    </div>
  );
}
