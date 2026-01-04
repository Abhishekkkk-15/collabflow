import { forwardRef, useImperativeHandle, useState } from "react";
import { MentionListRef } from "./MentionExtension";

export const MentionList = forwardRef<MentionListRef, any>(
  (props: any, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];
      if (item) props.command(item);
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: any) => {
        if (event.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % props.items.length);
          return true;
        }
        if (event.key === "ArrowUp") {
          setSelectedIndex(
            (selectedIndex - 1 + props.items.length) % props.items.length
          );
          return true;
        }
        if (event.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    return (
      <div className="bg-card border border-border rounded-md shadow-md p-1 w-64">
        {props.items.map((item: any, index: number) => (
          <button
            key={item.id}
            onClick={() => selectItem(index)}
            className={`flex items-center gap-3 w-full px-2 py-1.5 rounded-sm text-sm
            ${index === selectedIndex ? "bg-accent" : ""}`}>
            <img
              src={item.avatar}
              className="w-6 h-6 rounded-full"
              alt={item.label}
            />
            <span>@{item.label}</span>
          </button>
        ))}
      </div>
    );
  }
);
