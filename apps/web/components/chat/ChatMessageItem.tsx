import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ChatMessageItem({
  msg,
  currentUserId,
}: {
  msg: any;
  currentUserId: any;
}) {
  const isSelf = msg?.sender?.id === currentUserId;

  return (
    <div className={`flex gap-3 ${isSelf ? "justify-end" : ""}`}>
      {!isSelf && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={msg?.sender?.image} />
          <AvatarFallback>{msg?.sender?.image[0]}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
          isSelf ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}>
        {!isSelf && (
          <div className="text-xs font-semibold mb-1">{msg?.sender?.name}</div>
        )}
        {msg.content}
      </div>
    </div>
  );
}
