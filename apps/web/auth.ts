import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import ResendProvider from "next-auth/providers/resend";
import jwt from "jsonwebtoken";

// import { prisma } from "@/lib/prisma";
import { prisma } from "@collabflow/db";
import { Resend } from "resend";
import { MAGIC_LINK_TEMPLATE } from "./email-temp/magicLinktemplate";
const resend = new Resend(process.env.RESEND_API_KEY);
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    ResendProvider({
      apiKey: process.env.RESEND_API_KEY!,
      from: process.env.EMAIL_FROM!,
      async sendVerificationRequest({ identifier, url }) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: identifier,
          subject: "Sign in to CollabFlow",
          html: MAGIC_LINK_TEMPLATE({
            email: identifier,
            url,
          }),
        });
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
    verifyRequest: "/check-email",
  },

  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, user, token }) {
      if (session.user) {
        // session.user.id = user.id;
        // session.user.role = (user as any).role;
        session.user.role = token.role as string;
        session.user.id = token.id as string;

        session.accessToken = jwt.sign(
          {
            sub: token.id,
            id: token.id,
            role: token.role,
            image: token.image,
            email: token.email,
            name: token.name,
          },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: "30d" }
        );
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  secret: process.env.NEXTAUTH_SECRET,
});
