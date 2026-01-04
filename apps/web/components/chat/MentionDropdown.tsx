import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function MentionDropdown({
  members,
  onSelect,
}: {
  members: any;
  onSelect: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-14 left-4 w-60 bg-popover border rounded-lg shadow-lg p-2 z-50">
      {members.map((m: any) => (
        <div
          key={m.id}
          className="flex items-center gap-3 px-2 py-2 hover:bg-muted cursor-pointer rounded-md"
          onClick={() => onSelect(m)}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={m.image} />
            <AvatarFallback>{m.name[0]}</AvatarFallback>
          </Avatar>

          <div className="text-sm">{m.name}</div>
        </div>
      ))}
    </motion.div>
  );
}
