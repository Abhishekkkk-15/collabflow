"use server";
import { auth } from "@/auth";
import { cookies } from "next/headers";
export async function serverFetch(url: string) {
  const cookieHeader = cookies();
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/proxy${url}`, {
    headers: {
      Cookie: (await cookieHeader).toString(),
    },
    cache: "no-store",
  });
}
