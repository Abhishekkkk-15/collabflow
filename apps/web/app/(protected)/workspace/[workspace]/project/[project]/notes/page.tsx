import NotesClient from "@/components/notes/NotesClient";

export default async function NotesPage({
  params,
}: {
  params: { workspace: string; project: string };
}) {
  const { project, workspace } = await params;
  return <NotesClient />;
}
