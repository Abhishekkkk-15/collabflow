import ChatRoom from "@/components/chat/ChatRoom";
import Wrapper from "./wrapper";
import { auth } from "@/auth";
import { api } from "@/lib/api/api";
import { cookies } from "next/headers";

async function page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const { project, workspace } = await params;
  const session = auth();
  const cookieStore = cookies();
  const workspaceMembers = await api.get(`/workspace/${workspace}/members`, {
    headers: {
      Cookie: (await cookieStore).toString(),
    },
    withCredentials: true,
  });

  console.log("ws", workspaceMembers.data);

  return (
    <ChatRoom
      roomId={workspace}
      user={session}
      members={workspaceMembers.data.members}
    />
  );
}

export default page;
