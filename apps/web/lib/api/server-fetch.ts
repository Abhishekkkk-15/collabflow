"use server";
import { cookies } from "next/headers";

export async function serverFetch<T>(url: string): Promise<T> {
  const cookieHeader = cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: {
      Cookie: (await cookieHeader).toString(),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch server data");
  }

  return res.json();
}
