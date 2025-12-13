import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Copy, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = [
  { label: "Auto", value: null },
  { label: "Text", value: "text" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "JSON", value: "json" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "Bash", value: "bash" },
  { label: "Python", value: "python" },
  { label: "Go", value: "go" },
];

export function CodeBlockNodeView({ node, updateAttributes }: any) {
  const language = node.attrs.language ?? "auto";

  const copy = async () => {
    await navigator.clipboard.writeText(node.textContent);
  };

  return (
    <NodeViewWrapper className="not-prose my-6 overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* Header */}
      <div
        contentEditable={false}
        className="flex items-center justify-between border-b bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
        {/* Language dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 uppercase tracking-wide hover:text-foreground">
              {language === "auto" ? "AUTO" : language}
              <ChevronDown className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            {LANGUAGES.map(({ label, value }) => (
              <DropdownMenuItem
                key={label}
                onClick={() =>
                  updateAttributes({
                    language: value,
                  })
                }>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Copy */}
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={copy}>
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="m-0 px-4 py-3">
          <NodeViewContent as="code" />
        </pre>
      </div>
    </NodeViewWrapper>
  );
}
