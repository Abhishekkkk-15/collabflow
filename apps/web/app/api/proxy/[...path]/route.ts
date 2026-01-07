import { auth } from "@/auth";

const API = "http://localhost:3001";

async function handler(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth();
  console.log("PROXY HIT:", params);
  const paths = await params;
  console.log("paths", paths);
  if (!session) {
    console.log("not authenticaled", session);
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const incomingUrl = new URL(req.url);

  const search = incomingUrl.search;
  const backendUrl = `${API}/${paths.path.join("/")}${search}`;

  console.log("url", backendUrl);
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

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
