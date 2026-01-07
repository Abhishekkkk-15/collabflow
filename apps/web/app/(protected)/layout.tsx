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
  if (session == null) {
    redirect("/login");
  }
  let userRoles = null;
  const BASE = process.env.NEXT_PUBLIC_API_URL!;
  try {
    const res = await fetch(`${BASE}/api/proxy/user/roles`, {
      headers: {
        Cookie: (await cookieStore).toString(),
      },
    });
    userRoles = res?.json() ?? null;
  } catch (err) {
    throw err;
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
