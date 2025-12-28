import DefaultDashboard from "@/components/self/DefaultDashboard";
import getQueryClient from "@/lib/react-query/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import {
  dashboardQueryOptions,
  fetchDashboardServer,
} from "@/lib/react-query/dashboard.query";
import getServerSession from "next-auth";
import { auth } from "@/auth";
export default async function Page() {
  const queryClient = getQueryClient();

  const session = await auth();

  const data = await fetchDashboardServer();

  queryClient.setQueryData(dashboardQueryOptions.queryKey, data);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DefaultDashboard user={session?.user} />
    </HydrationBoundary>
  );
}
