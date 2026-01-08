import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { redirect } from "next/navigation";
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
  icons: {
    icon: "/icon.svg",
  },
};
import { ThemeProvider } from "@/components/theme-provider";

import ReduxProvider from "@/lib/redux/provider";
import ReactQueryProvider from "@/lib/react-query/Provider";
import { auth } from "@/auth";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
