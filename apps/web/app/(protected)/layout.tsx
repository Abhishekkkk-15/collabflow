import { auth } from "@/auth";
import ClientSessionSync from "@/components/helper/ClientSessionSync";
import SocketProvider from "@/components/providers/SocketProvider";
import { api } from "@/lib/api/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();

  const session = await auth();
  console.log("for protected", session);
  if (session == null) {
    redirect("/login");
  }
  let userRoles = null;
  try {
    const res = await api.get(`/user/roles`, {
      headers: {
        Cookie: (await cookieStore).toString(),
      },
      withCredentials: true,
    });
    userRoles = res?.data ?? null;
  } catch (err) {
    console.log("Could not fetch user roles:");
  }

  return (
    <>
      <SocketProvider userId={session?.user?.id}>
        {children}
        <ClientSessionSync session={session} userRoles={userRoles} />
      </SocketProvider>
    </>
  );
}
