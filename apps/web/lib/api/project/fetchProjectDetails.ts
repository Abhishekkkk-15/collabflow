const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProject(slug: string) {
  const res = await fetch(`${BASE}/api/proxy/project?slug=${slug}`, {
    headers: {
      Cookie: (await cookieStore).toString(),
    },
    cache: "no-store",
  });
  return res.json();
}
