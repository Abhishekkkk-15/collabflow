import { useState, useEffect } from "react";
import MentionDropdown from "./MentionDropdown";
import { Input } from "@/components/ui/input";
import { Socket } from "socket.io-client";
import { v4 as uuidV4 } from "uuid";
export default function ChatInput({
  user,
  members,
  roomId,
  socket,
}: {
  user: any;
  members: any;
  roomId: any;
  socket: Socket;
}) {
  const [text, setText] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    if (!socket) return;
    socket.emit("typing", {
      payload: { roomId, userId: user.id, isTyping: text.length > 0 },
    });
  }, [text]);

  const handleChange = (val: string) => {
    setText(val);

    const mentionIndex = val.lastIndexOf("@");
    if (mentionIndex !== -1) {
      const query = val.slice(mentionIndex + 1).toLowerCase();
      console.log("query", query);
      const matches = members.filter((m: any) =>
        m.user.name.toLowerCase().includes(query)
      );
      console.log("object", matches);
      setFilteredMembers(matches);
      setMentionOpen(true);
    } else {
      setMentionOpen(false);
    }
  };

  const send = () => {
    if (!text.trim()) return;
    if (!socket) return;
    console.log("socket", socket);
    let clientMessageId = uuidV4();
    socket.emit("send", {
      payload: {
        roomId,
        clientMessageId,
        text,
        mentionedUser: selectedUser,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      },
    });
    console.log("message", user);
    setText("");
    setMentionOpen(false);
  };

  return (
    <div className="p-4 border-t relative">
      <Input
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Message @someone…"
        className="pr-20"
      />

      {mentionOpen && filteredMembers.length > 0 && (
        <MentionDropdown
          members={filteredMembers}
          onSelect={(m: any) => {
            const lastAt = text.lastIndexOf("@");
            const updated = text.slice(0, lastAt + 1) + m.user.name + " ";
            setSelectedUser(m.user.id);
            console.log("selected", m);
            setText(updated);
            setMentionOpen(false);
          }}
        />
      )}

      <button
        onClick={send}
        className="absolute right-6 bottom-6 text-sm bg-primary text-primary-foreground px-3 py-1 rounded-lg">
        Send
      </button>
    </div>
  );
}
