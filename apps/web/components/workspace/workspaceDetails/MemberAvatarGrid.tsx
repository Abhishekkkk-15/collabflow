"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface MemberAvatarGridProps {
  members: any[];
}

export default function MemberAvatarGrid({ members }: MemberAvatarGridProps) {
  const visible = members || [];
  const rest = Math.max(0, (members?.length || 0) - visible.length);

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-3">
        {visible.map((m: any, idx: number) => (
          <div key={idx} className="relative">
            <Avatar className="h-9 w-9 ring-2 ring-background">
              {m.user?.image ? (
                <AvatarImage src={m.user.image} />
              ) : (
                <AvatarFallback>
                  {m.user?.name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        ))}

        {rest > 0 && (
          <div className="h-9 w-9 rounded-full bg-muted text-xs grid place-items-center">
            +{rest}
          </div>
        )}
      </div>
    </div>
  );
}
