// /app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: unknown;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

interface Admin {
  id: number;
  username: string;
  password_hash: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) return null;

        try {
          const res = await fetch("http://127.0.0.1:8000/api/admins");
          const admins: Admin[] = await res.json();

          const admin = admins.find(a => a.username === credentials.username);
          if (!admin) return null;

          const match = await bcrypt.compare(credentials.password, admin.password_hash);
          if (!match) return null;

          return { id: admin.id.toString(), name: admin.username, role: "admin" };
        } catch (err) {
          console.error("Auth error:", err);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user }) {
      try {
        if (user.email && !user.role) {
          await db.query(
            `INSERT INTO users (name, email)
             VALUES ($1, $2)
             ON CONFLICT (email) DO NOTHING`,
            [user.name || "Unnamed", user.email]
          );
        }
      } catch (err) {
        console.error("Error inserting user:", err);
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user?.role) token.role = user.role;
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) || "user";
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
