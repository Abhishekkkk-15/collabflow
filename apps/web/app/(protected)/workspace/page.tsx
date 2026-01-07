import DefaultDashboard from "@/components/self/DefaultDashboard";
import getQueryClient from "@/lib/react-query/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { dashboardQueryOptions } from "@/lib/react-query/dashboard.query";
import { auth } from "@/auth";
import { cookies } from "next/headers";
export default async function Page() {
  const queryClient = getQueryClient();
  const cookieStore = cookies();

  const session = await auth();
  console.log("sess", session);
  const res = await fetch(`http://localhost:3000/api/proxy/user/dashboard/me`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      cookie: (await cookieStore).toString(), // 🔥 THIS IS THE KEY
    },
  });

  if (!res.ok) {
    // console.log)
    console.log(res);
    throw new Error("Failed to fetch dashboard data");
  }

  const data = await res.json();

  queryClient.setQueryData(dashboardQueryOptions.queryKey, data);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DefaultDashboard user={session?.user} />
    </HydrationBoundary>
  );
}
