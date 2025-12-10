// components/notes/extensions/Callout.ts
import { Node, mergeAttributes } from "@tiptap/core";

export default Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  selectable: true,

  parseHTML() {
    return [{ tag: "div[data-type='callout']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-type": "callout", class: "tiptap-callout" },
        HTMLAttributes
      ),
      0,
    ];
  },

  addCommands() {
    return {
      // inserts a callout wrapper around the selection
      setCallout:
        () =>
        ({ chain }: { chain: any }) => {
          // use chain() and run() so return type is boolean
          return chain().focus().wrapIn(this.name).run();
        },

      // toggles the callout wrapper
      toggleCallout:
        () =>
        ({ chain }: { chain: any }) => {
          return chain().focus().toggleWrap(this.name).run();
        },
    };
  },
});
