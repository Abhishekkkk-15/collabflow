import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ChatMessageItem({
  msg,
  currentUserId,
}: {
  msg: any;
  currentUserId: any;
}) {
  const isSelf = msg.user.id === currentUserId;
  console.log("from item's", msg);
  return (
    <div className={`flex gap-3 ${isSelf ? "justify-end" : ""}`}>
      {!isSelf && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={msg.user.image} />
          <AvatarFallback>{msg.user.name[0]}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
          isSelf ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}>
        {!isSelf && (
          <div className="text-xs font-semibold mb-1">{msg.user.name}</div>
        )}
        {msg.text}
      </div>
    </div>
  );
}
