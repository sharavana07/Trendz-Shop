"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black text-white shadow-md">
      <div className="text-2xl font-bold tracking-wide">
        Trendz<span className="text-gray-400">Shop</span>
      </div>

      <div className="space-x-6 text-sm font-medium">
        <Link href="/admin" className="hover:text-gray-300 transition">
          Admin
        </Link>
        <Link href="/adminlogin" className="hover:text-gray-300 transition">
          Admin Login
        </Link>
        <Link href="/login" className="hover:text-gray-300 transition">
          Login
        </Link>
        <Link href="/products" className="hover:text-gray-300 transition">
          Products
        </Link>
        <Link href="/my-orders" className="hover:text-gray-300 transition">
          My Orders
        </Link>
        <Link href="/order-summary" className="hover:text-gray-300 transition">
          Order Summary
        </Link>
        <Link href="/cart" className="hover:text-gray-300 transition">
          Cart
        </Link>
      </div>
    </nav>
  );
}
