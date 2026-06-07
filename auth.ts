import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";

const SESSION_SHORT = 8 * 60 * 60;       // 8 hours — without "remember me"
const SESSION_LONG  = 30 * 24 * 60 * 60; // 30 days  — with "remember me"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email:      { label: "Email",       type: "email"    },
        password:   { label: "Password",    type: "password" },
        rememberMe: { label: "Remember me", type: "text"     },
      },
      authorize: async (credentials) => {
        const email      = credentials?.email      as string | undefined;
        const password   = credentials?.password   as string | undefined;
        const rememberMe = credentials?.rememberMe === "true";
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.hashedPassword);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name ?? user.email, rememberMe };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: SESSION_LONG },
  pages: {
    signIn: "/he/auth/login",
  },
  // Persistent cookie — JWT expiry controls actual session length
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: false,
        maxAge: SESSION_LONG,
      },
    },
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        const duration = (user as { rememberMe?: boolean }).rememberMe ? SESSION_LONG : SESSION_SHORT;
        token.exp = Math.floor(Date.now() / 1000) + duration;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: { ...session.user, id: token.id as string },
    }),
  },
});
