import ChatRoom from "@/components/chat/ChatRoom";
import { auth } from "@/auth";
import { api } from "@/lib/api/api";
import { cookies } from "next/headers";
import { User } from "next-auth";

async function page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const BASE = process.env.NEXT_PUBLIC_API_URL!;
  const { project, workspace } = await params;
  const session = await auth();
  const cookieStore = cookies();
  const workspaceMembers = await api.get(
    `${BASE}/workspace/${workspace}/members`,
    {
      headers: {
        Cookie: (await cookieStore).toString(),
      },
      withCredentials: true,
    }
  );

  let userFromSession: User;
  if (session?.user) {
    userFromSession = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      role: session.user.role,
    };
  }

  return <ChatRoom roomId={`workspace:${workspace}`} user={userFromSession!} />;
}

export default page;
