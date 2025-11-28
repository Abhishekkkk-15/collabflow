import Wrapper from "./wrapper";

async function page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const { project, workspace } = await params;

  return <Wrapper params={{ project, workspace }} />;
}

export default page;
