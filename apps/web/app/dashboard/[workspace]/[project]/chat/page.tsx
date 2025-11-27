// import ChatLayout from "@/components/chat/ChatLayout";
import PageWithSidebarClient from "@/components/self/PageWithSidebarClient";
import Wrapper from "./wrapper";

async function page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const { project, workspace } = await params;

  return (
    <PageWithSidebarClient
      Component={Wrapper}
      componentProps={{ project, workspace }}
      params={{ project, workspace }}
    />
  );
}

export default page;
