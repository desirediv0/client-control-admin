import prisma from "@/db/db.config";
import { CustomJWT, CustomSession } from "@/types/type";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials ?? {};
        if (!email || !password) {
          throw new Error("You must provide an email and password");
        }

        const user = await prisma.user.findFirst({
          where: { email },
        });

        if (!user) {
          throw new Error("No user found");
        }

        return {
          id: String(user.id),
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      const existingUser = await prisma.user.findFirst({
        where: { email: user.email! },
      });
      if (existingUser) {
        return true;
      }
      return false;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        const dbUser = await prisma.user.findFirst({
          where: {
            email: user.email!,
          },
        });

        if (dbUser) {
          (token as CustomJWT).userId = dbUser.id.toString();
          token.email = dbUser.email;
          token.name = dbUser.name;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      const customToken = token as CustomJWT;
      if (customToken?.userId) {
        const dbUser = await prisma.user.findFirst({
          where: { id: customToken.userId },
        });

        if (dbUser) {
          (session as CustomSession).user = {
            id: dbUser.id.toString(),
            email: dbUser.email,
            name: dbUser.name,
          };
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/authenticate",
    error: "/authenticate",
  },
};
