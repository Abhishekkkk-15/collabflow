import Mention from "@tiptap/extension-mention";
import { Editor, ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { MentionList } from "./MentionList";
const mentionRenderer = () => {
  let component: ReactRenderer | null = null;
  let popup: any = null;

  return {
    onStart: (props: any) => {
      component = new ReactRenderer(MentionList, {
        props,
        editor: props.editor,
      });

      popup = tippy(document.body, {
        getReferenceClientRect: () => {
          const rect = props.clientRect?.();
          return rect ?? new DOMRect(0, 0, 0, 0);
        },
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },

    onUpdate(props: any) {
      component?.updateProps(props);

      popup?.[0]?.setProps({
        getReferenceClientRect: () => {
          const rect = props.clientRect?.();
          return rect ?? new DOMRect(0, 0, 0, 0);
        },
      });
    },

    onKeyDown(props: any) {
      return component?.ref!.onKeyDown(props);
    },

    onExit() {
      popup?.[0]?.destroy();
      component?.destroy();
    },
  };
};
const members = [
  {
    id: "1",
    label: "Abhishek",
    avatar: "https://i.pravatar.cc/32?img=3",
  },
  {
    id: "2",
    label: "Rahul",
    avatar: "https://i.pravatar.cc/32?img=5",
  },
];
export const MentionExtension = Mention.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      {
        ...HTMLAttributes,
        class: "mention",
        "data-id": node.attrs.id,
        "data-label": node.attrs.label,
        "data-avatar": node.attrs.avatar,
      },
      [
        "img",
        {
          src: node.attrs.avatar,
          class: "mention-avatar",
          contenteditable: "false",
        },
      ],
      `@${node.attrs.label}`,
    ];
  },
  addAttributes() {
    return {
      id: { default: null },
      label: { default: null },
      avatar: { default: null },
    };
  },
}).configure({
  HTMLAttributes: {
    class: "mention",
  },

  suggestion: {
    char: "@",

    items: ({ query }) =>
      members.filter((member) =>
        member.label.toLowerCase().includes(query.toLowerCase())
      ),

    command: ({
      editor,
      range,
      props,
    }: {
      props: any;
      editor: Editor;
      range: any;
    }) => {
      editor
        .chain()
        .focus()
        .insertContentAt(range, {
          type: "mention",
          attrs: {
            id: props.id,
            label: props.label,
            avatar: props.avatar,
          },
        })
        .run();
    },

    render: mentionRenderer,
  },
});
