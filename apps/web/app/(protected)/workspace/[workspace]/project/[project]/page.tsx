import ProjectDetails from "@/components/project/ProjectDetails";
import { serverFetch } from "@/lib/api/server-fetch";
import { cookies } from "next/headers";

async function page({
  params,
}: {
  params: { project: string; workspace: string };
}): Promise<any> {
  const { project } = await params;
  const BASE = process.env.NEXT_PUBLIC_API_URL;

  const cookieStore = cookies();

  // const res = await fetch(`${BASE}/api/proxy/project?slug=${project}`, {
  //   headers: {
  //     Cookie: (await cookieStore).toString(),
  //   },
  // });
  const res = await serverFetch(`/project?slug=${project}`);
  const data = await res.json();
  return (
    <div>
      <ProjectDetails slug={project} data={data} />
    </div>
  );
}

export default page;
