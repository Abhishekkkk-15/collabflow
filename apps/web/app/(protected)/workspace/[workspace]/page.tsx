import WorkspaceDetails from "@/components/workspace/workspaceDetails/WorkspaceDetails";
import { fetchWorkspaceDetails } from "@/lib/api/workspace/fetchWorkspaceDetails";
import getQueryClient from "@/lib/react-query/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function Page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const queryClient = getQueryClient();
  const { workspace: workspaceSlug } = await params;

  await queryClient.prefetchQuery({
    queryKey: ["workspace", workspaceSlug],
    queryFn: () => fetchWorkspaceDetails(workspaceSlug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WorkspaceDetails workspaceSlug={workspaceSlug} userRole="MEMBER" />
    </HydrationBoundary>
  );
}
