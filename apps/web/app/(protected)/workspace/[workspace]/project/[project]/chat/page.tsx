import ChatRoom from "@/components/chat/ChatRoom";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { api } from "@/lib/api/api";
import { User } from "next-auth";
import getQueryClient from "@/lib/react-query/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchProjectMembers } from "@/lib/api/project/members";

async function page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const { project, workspace } = await params;
  const session = await auth();
  const cookieStore = cookies();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["project-members", project, ""],
    queryFn: async () => fetchProjectMembers(project, 2),
  });
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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatRoom roomId={`project:${project}`} user={userFromSession!} />
    </HydrationBoundary>
  );
}

export default page;
