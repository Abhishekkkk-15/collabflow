"use client";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

interface ColorPickerProps {
  label: string;
  colors: string[];
  onColorSelect: (color: string) => void;
  currentColor?: string;
}

export function ColorPicker({
  label,
  colors,
  onColorSelect,
  currentColor,
}: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <div
            className="w-4 h-4 rounded border ring-ring bg-card"
            style={{ backgroundColor: currentColor || "transparent" }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="space-y-2">
          <p className="text-sm font-medium">{label}</p>
          <div className="grid grid-cols-6 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border-2 hover:hover ring-ring transition-all"
                style={{
                  backgroundColor: color,
                  borderColor: currentColor === color ? "#000" : "#ccc",
                }}
                onClick={() => onColorSelect(color)}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
