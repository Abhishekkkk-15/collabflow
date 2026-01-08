import { auth } from "@/auth";
export const dynamic = "force-dynamic";
export const revalidate = 0;
const API = process.env.NEXT_PUBLIC_BACKEND_URL!;

async function handler(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth();
  const paths = await params;
  console.log("PROXY HIT:", req.url);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const incomingUrl = new URL(req.url);

  const search = incomingUrl.search;
  const backendUrl = `${API}/${paths.path.join("/")}${search}`;

  const res = await fetch(backendUrl, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: req.method === "GET" ? undefined : await req.text(),
    cache: "no-store",
  });
  if (!res.ok) {
    return new Response(await res.text(), {
      status: res.status,
      headers: res.headers,
    });
  }
  return new Response(await res.text(), {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
