import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CollabFlow",
  description: "CollabFlow a collabrative notion app",
};
import { ThemeProvider } from "@/components/theme-provider";

import ReduxProvider from "@/lib/redux/provider";
import ReactQueryProvider from "@/lib/react-query/Provider";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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
