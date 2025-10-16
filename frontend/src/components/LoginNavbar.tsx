"use client";

import Link from "next/link";

export default function LoginNavbar() {
  return (
    <nav className="w-full bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Brand Name */}
        <Link href="/" className="text-2xl font-bold tracking-wide hover:text-gray-300 transition">
          Trendz<span className="text-gray-400">Shop</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm hover:text-gray-300 transition"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="text-sm hover:text-gray-300 transition"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="text-sm hover:text-gray-300 transition"
          >
            Contact
          </Link>

          {/* Login Button */}
          <Link
            href="/login"
            className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
