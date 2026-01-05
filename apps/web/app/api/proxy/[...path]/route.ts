import { auth } from "@/auth";

const API = process.env.NEXT_PUBLIC_API_URL;

async function handler(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const session = await auth();
  if (!session?.accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = `${API}/${params.path.join("/")}`;
  console.log("url", url);
  const res = await fetch(url, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: req.method === "GET" ? undefined : await req.text(),
    cache: "no-store",
  });

  const data = await res.text();
  return new Response(data, { status: res.status });
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
