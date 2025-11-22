"use client";

import { useEffect, useRef, useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function UserProfile({ data }: { data: any }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // CLOSE WHEN CLICKING OUTSIDE
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <Collapsible open={open} onOpenChange={setOpen}>
        {/* Trigger Section */}
        <CollapsibleTrigger className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-muted transition">
          <Avatar className="h-10 w-10 shadow">
            <AvatarImage src={data.image} />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>

          <div className="flex flex-col text-left">
            <p className="text-base font-semibold leading-tight">{data.name}</p>
            <p className="text-xs text-muted-foreground leading-tight">
              {data.email}
            </p>
          </div>

          <ChevronDown
            className={`ml-auto transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>

        {/* Content Section */}
        <CollapsibleContent className="mt-3 border p-4 rounded-xl bg-card shadow-md space-y-4">
          {/* Profile Info */}
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Email:</span> {data.email}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Account Created:</span> Jan 2024
            </p>
            <p className="text-sm">
              <span className="font-semibold">Bio:</span> MERN & React Native
              Developer.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t my-2"></div>

          {/* Logout Button */}
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
