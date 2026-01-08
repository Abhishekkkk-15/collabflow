"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: false,
          },
        },
      })
  );

  setInterval(() => {
    async function handleWorkerAwake() {
      const WORKER_BASE = process.env.NEXT_PUBLIC_WORKER_URL;
      await axios.get(`${WORKER_BASE}/`);
    }
    handleWorkerAwake();
  }, 900000);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
