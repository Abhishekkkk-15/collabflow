import { QueryClient } from "@tanstack/react-query";

export default function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 min (important for hydration)
        retry: false,
      },
    },
  });
}
