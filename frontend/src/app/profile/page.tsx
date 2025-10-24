"use client";

import { User, Mail, Phone, LogOut, Package, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Fetch user details (replace URL with your FastAPI endpoint)
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:8000/users/me", {
          credentials: "include",
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to load user profile:", err);
        setUser({
          name: "Sharavana Ragav",
          email: "sharavana@example.com",
          phone: "+91 98765 43210",
          address: "Coimbatore, Tamil Nadu",
        }); // fallback for dev mode
      }
    }
    fetchUser();
  }, []);

  if (!user)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-300 text-lg">
        Loading your profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white py-16 px-6">
      <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 shadow-lg">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-8">My Profile</h1>

        {/* Profile Info */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-400 flex items-center gap-2 mt-2">
            <Mail size={18} /> {user.email}
          </p>
          <p className="text-gray-400 flex items-center gap-2 mt-1">
            <Phone size={18} /> {user.phone}
          </p>
          {user.address && (
            <p className="text-gray-400 flex items-center gap-2 mt-1">
              <MapPin size={18} /> {user.address}
            </p>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-10 space-y-4">
          <Link
            href="/my-orders"
            className="flex items-center justify-between bg-purple-600/10 border border-purple-500/30 hover:bg-purple-600/20 transition-all px-6 py-3 rounded-xl"
          >
            <span className="flex items-center gap-2">
              <Package size={20} /> My Orders
            </span>
            <span className="text-purple-400">→</span>
          </Link>

          <Link
            href="/wishlist"
            className="flex items-center justify-between bg-purple-600/10 border border-purple-500/30 hover:bg-purple-600/20 transition-all px-6 py-3 rounded-xl"
          >
            <span className="flex items-center gap-2">
              <Heart size={20} /> Wishlist
            </span>
            <span className="text-purple-400">→</span>
          </Link>

          <Link
            href="/addresses"
            className="flex items-center justify-between bg-purple-600/10 border border-purple-500/30 hover:bg-purple-600/20 transition-all px-6 py-3 rounded-xl"
          >
            <span className="flex items-center gap-2">
              <MapPin size={20} /> Saved Addresses
            </span>
            <span className="text-purple-400">→</span>
          </Link>

          <button className="w-full flex items-center justify-center gap-2 mt-6 bg-purple-600 hover:bg-purple-700 transition-all text-white px-6 py-3 rounded-xl">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
