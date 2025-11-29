import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CollabFlow",
  description: "CollabFlow a collabrative notion app",
};
import { ThemeProvider } from "@/components/theme-provider";
import SocketProvider from "@/components/providers/SocketProvider";
import { auth } from "@/auth";
import ReduxProvider from "@/lib/redux/provider";
import ClientSessionSync from "@/components/helper/ClientSessionSync";
import { redirect } from "next/navigation";
import axios from "axios";
import { cookies } from "next/headers";
import { api } from "@/lib/api/api";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();

  const session = await auth();
  // if (!session) redirect("/login");
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {" "}
        <ReduxProvider>
          <SocketProvider userId={session?.user?.id}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange>
              {children}

              <ClientSessionSync session={session} userRoles={userRoles} />
              <Toaster />
            </ThemeProvider>
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
