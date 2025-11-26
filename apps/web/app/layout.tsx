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
import { Provider } from "react-redux";
import ReduxProvider from "@/lib/redux/provider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {" "}
        <ReduxProvider>
          <SocketProvider userId={session?.user?.id}>
            <ThemeProvider
              attribute="class"
              defaultTheme="violet"
              enableSystem
              disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
