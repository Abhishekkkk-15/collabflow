import ChatRoom from "@/components/chat/ChatRoom";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { api } from "@/lib/api/api";
import { User } from "next-auth";

async function page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const { project, workspace } = await params;
  const session = await auth();
  const cookieStore = cookies();
  // const projectMembers = await api.get(`/project/${project}/members`, {
  //   headers: {
  //     Cookie: (await cookieStore).toString(),
  //   },
  //   withCredentials: true,
  // });
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
  return (
    <ChatRoom
      roomId={`project:${project}`}
      user={userFromSession!}
      // members={projectMembers.data.members}
      members={[]}
    />
  );
}

export default page;
