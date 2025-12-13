import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MentionHoverCardProps {
  id: string;
  label: string;
  avatar: string;
}

export function MentionHoverCard({ id, label, avatar }: MentionHoverCardProps) {
  return (
    <Card className="w-64 shadow-lg">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} alt={label} />
          <AvatarFallback>{label.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0">
          <span className="font-semibold leading-tight truncate">{label}</span>
          <span className="text-sm text-muted-foreground">
            Workspace member
          </span>

          {/* optional action hint */}
          <span className="mt-1 text-xs text-muted-foreground">
            Click to view profile
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
