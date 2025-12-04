import TasksTable from "@/components/self/TasksTable";

async function page({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const { workspace, project } = await params;

  return (
    <>
      <TasksTable />
    </>
  );
}

export default page;
