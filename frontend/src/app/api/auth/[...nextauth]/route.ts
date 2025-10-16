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
    id?: number;
    role?: string;
  }
  interface Session {
    user: {
      id?: number;
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

          return { id: admin.id, name: admin.username, role: "admin" };
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
    console.log("signIn callback, user:", user);
      try {
        if (user.email && !user.role) {
          // Insert or fetch existing user from DB
          const insertRes = await db.query<{ id: number }>(
            `INSERT INTO users (name, email)
             VALUES ($1, $2)
             ON CONFLICT (email) DO NOTHING
             RETURNING id`,
            [user.name || "Unnamed", user.email]
          );

          let userId: number;
          if (insertRes.rows.length > 0) {
            userId = insertRes.rows[0].id;
          } else {
            const existing = await db.query<{ id: number }>(
              `SELECT id FROM users WHERE email = $1`,
              [user.email]
            );
            userId = existing.rows[0].id;
          }

          user.id = userId;
          user.role = "user";
        }
      } catch (err) {
        console.error("Error inserting/fetching user:", err);
        return false;
      }
      return true;
    },

    async jwt({ token, user }) {
      
    if (user) console.log("jwt callback, user:", user);
      if (user?.role) token.role = user.role;
      if (user?.id) token.id = user.id;
    console.log("jwt callback, token:", token);
      return token;
    },

    async session({ session, token }) {
      
    console.log("session callback, before:", session.user);
      if (session.user) {
        session.user.role = (token.role as string) || "user";
        session.user.id = token.id as number;
      }
    console.log("session callback, after:", session.user);
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
