// /app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Extend NextAuth types
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

// Admin type
interface Admin {
  id: number;
  username: string;
  password_hash: string;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
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
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.role) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as string;
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
// /app/api/auth/[...nextauth]/route.ts
export { authOptions }; // add this line at the end
