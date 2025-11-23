
export default async function Layout({ children, params }) {
  const { workspace, project } = await params;

  return <Wrapper workspace={workspace} project={project}>{children}</Wrapper>;
}
