/// <reference types="next-auth" />
import NextAuth, { DefaultSession } from "next-auth";
import { string } from "zod";
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    } & DefaultSession["user"] & { accessToken: string };
  }
  interface User {
    id: string;
    role?: string;
  }
}
