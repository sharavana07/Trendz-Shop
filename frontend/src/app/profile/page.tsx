"use client";

import { User, Mail, Phone, LogOut, Package, Heart, MapPin, Settings, ChevronRight } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#111827] via-[#1a1f35] to-[#111827]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#F9FAFB] text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#111827] via-[#1a1f35] to-[#111827]">
        <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md">
          <User className="w-16 h-16 text-[#7C3AED] mx-auto mb-4" />
          <p className="text-[#F9FAFB] text-xl font-semibold mb-2">Authentication Required</p>
          <p className="text-[#D1D5DB] text-sm">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const user = {
    name: session.user?.name || "Guest User",
    email: session.user?.email || "No email",
    image: session.user?.image || "",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111827] via-[#1a1f35] to-[#111827] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-8 mb-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/20 backdrop-blur-md border-4 border-white flex items-center justify-center shadow-xl">
                  <User className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{user.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-white/90 mb-3">
                <Mail size={18} />
                <span className="text-base">{user.email}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-white font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Active Member
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-[#F9FAFB] mb-4 px-2">Quick Actions</h2>
            
            <Link
              href="/my-orders"
              className="group flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#7C3AED] hover:bg-white/15 transition-all duration-300 px-6 py-4 rounded-xl shadow-lg hover:shadow-purple-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Package size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-[#F9FAFB] font-semibold text-base">My Orders</p>
                  <p className="text-[#D1D5DB] text-sm">Track and manage your orders</p>
                </div>
              </div>
              <ChevronRight className="text-[#7C3AED] group-hover:translate-x-1 transition-transform duration-300" size={24} />
            </Link>

            <Link
              href="/wishlist"
              className="group flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#7C3AED] hover:bg-white/15 transition-all duration-300 px-6 py-4 rounded-xl shadow-lg hover:shadow-purple-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Heart size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-[#F9FAFB] font-semibold text-base">Wishlist</p>
                  <p className="text-[#D1D5DB] text-sm">Your favorite items</p>
                </div>
              </div>
              <ChevronRight className="text-[#7C3AED] group-hover:translate-x-1 transition-transform duration-300" size={24} />
            </Link>

            <Link
              href="/addresses"
              className="group flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#7C3AED] hover:bg-white/15 transition-all duration-300 px-6 py-4 rounded-xl shadow-lg hover:shadow-purple-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-[#F9FAFB] font-semibold text-base">Saved Addresses</p>
                  <p className="text-[#D1D5DB] text-sm">Manage delivery locations</p>
                </div>
              </div>
              <ChevronRight className="text-[#7C3AED] group-hover:translate-x-1 transition-transform duration-300" size={24} />
            </Link>
          </div>

          {/* Account Settings - Right Column */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#F9FAFB] mb-4 px-2">Account</h2>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Settings size={20} className="text-white" />
                </div>
                <h3 className="text-[#F9FAFB] font-semibold text-base">Settings</h3>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-[#D1D5DB] text-sm">Account Status</span>
                  <span className="text-green-400 text-sm font-semibold">Active</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-[#D1D5DB] text-sm">Member Since</span>
                  <span className="text-[#F9FAFB] text-sm font-semibold">2024</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#D1D5DB] text-sm">Profile Type</span>
                  <span className="text-[#F9FAFB] text-sm font-semibold">Standard</span>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all duration-300 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-red-500/30 hover:scale-105"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center shadow-lg">
            <p className="text-[#D1D5DB] text-sm mb-1">Total Orders</p>
            <p className="text-[#F9FAFB] text-3xl font-bold">0</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center shadow-lg">
            <p className="text-[#D1D5DB] text-sm mb-1">Wishlist Items</p>
            <p className="text-[#F9FAFB] text-3xl font-bold">0</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center shadow-lg">
            <p className="text-[#D1D5DB] text-sm mb-1">Saved Addresses</p>
            <p className="text-[#F9FAFB] text-3xl font-bold">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}