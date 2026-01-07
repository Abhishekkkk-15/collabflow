import WorkspaceDetails from "@/components/workspace/workspaceDetails/WorkspaceDetails";
import getQueryClient from "@/lib/react-query/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";

export default async function Page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const queryClient = getQueryClient();
  const { workspace: workspaceSlug } = await params;
  const NEXT_PUBLIC_URL = process.env.AUTH_URL!;
  // await queryClient.prefetchQuery({
  //   queryKey: ["workspace", workspaceSlug],
  //   queryFn: () => fetchWorkspaceDetailsServer(workspaceSlug),
  // });
  const cookieStore = cookies();

  const res = await fetch(
    `${NEXT_PUBLIC_URL}/api/proxy/workspace/${workspaceSlug}`,
    {
      cache: "no-store",
      credentials: "include",
      headers: {
        cookie: (await cookieStore).toString(),
      },
    }
  );

  if (!res.ok) {
    throw new Error("Unable to fetch workspace details");
  }

  const workspace = await res.json();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WorkspaceDetails
        workspaceSlug={workspaceSlug}
        userRole="MEMBER"
        workspace={workspace}
      />
    </HydrationBoundary>
  );
}
