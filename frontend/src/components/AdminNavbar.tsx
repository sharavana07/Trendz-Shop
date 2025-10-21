"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-3 bg-black/40 backdrop-blur-lg border-b border-gray-800">
      {/* Left side - logo and links */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-violet-400">Trendz Admin</h1>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-gray-300 hover:text-violet-400 transition">
            Dashboard
          </Link>
          <Link href="/admin/add-product" className="text-gray-300 hover:text-violet-400 transition">
            Add Product
          </Link>
          <Link href="/admin/orders" className="text-gray-300 hover:text-violet-400 transition">
            Orders
          </Link>
        </div>
      </div>

      {/* Right side - user info + logout */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-300">
          {session?.user?.name ? `Hi, ${session.user.name}` : "Loading..."}
        </p>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="text-sm border-gray-600 text-gray-200 hover:bg-violet-600 hover:text-white"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
