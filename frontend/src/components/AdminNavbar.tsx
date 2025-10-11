"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-3 bg-black/40 backdrop-blur-lg border-b border-gray-800">
      <h1 className="text-xl font-bold text-violet-400">Trendz Admin</h1>
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-300">
          {session?.user?.name ? `Hi, ${session.user.name}` : "Loading..."}
        </p>
        <Button onClick={handleLogout} variant="outline" className="text-sm">
          Logout
        </Button>
      </div>
    </nav>
  );
}
