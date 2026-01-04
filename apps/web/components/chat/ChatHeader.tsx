import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ChatHeader({
  roomId,
  members,
}: {
  roomId: string;
  members: any[];
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-muted/40">
      <div>
        <h2 className="font-semibold text-lg">Group Chat</h2>
        <p className="text-xs text-muted-foreground">
          {members.length} members online
        </p>
      </div>

      <div className="flex -space-x-2">
        {members?.slice(0, 4).map((m) => (
          <Avatar key={m.id} className="h-7 w-7 border">
            <AvatarImage src={m.image} />
            <AvatarFallback>{m.name[0]}</AvatarFallback>
          </Avatar>
        ))}
        {members.length > 4 && (
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs">
            +{members.length - 4}
          </div>
        )}
      </div>
    </div>
  );
}
