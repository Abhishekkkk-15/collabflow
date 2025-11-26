"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function CalendarDialog({
  onSelectDate,
  trigger,
}: {
  onSelectDate?: (date: Date | undefined) => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  const [dropdown, setDropdown] =
    React.useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    );

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleSave = () => {
    onSelectDate?.(date);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      </DialogTrigger>

      {/* Modal Content */}
      <DialogContent className="w-auto">
        <DialogHeader>
          <DialogTitle>Select Due Date</DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-3">
          {/* Calendar */}
          <Calendar
            mode="single"
            defaultMonth={date}
            selected={date}
            onSelect={setDate}
            captionLayout={dropdown}
            className="rounded-lg border shadow-sm size-fit"
          />

          {/* Dropdown */}
          <div className="grid gap-2">
            <Label htmlFor="dropdown">Calendar View</Label>

            <Select
              value={dropdown}
              onValueChange={(value) =>
                setDropdown(
                  value as React.ComponentProps<
                    typeof Calendar
                  >["captionLayout"]
                )
              }>
              <SelectTrigger id="dropdown" className="w-auto">
                <SelectValue placeholder="Dropdown" />
              </SelectTrigger>

              <SelectContent align="center">
                <SelectItem value="dropdown">Month and Year</SelectItem>
                <SelectItem value="dropdown-months">Month Only</SelectItem>
                <SelectItem value="dropdown-years">Year Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
