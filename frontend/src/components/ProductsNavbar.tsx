"use client";
import Link from "next/link";

export default function ProductsNavbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black/70 backdrop-blur-md shadow-md sticky top-0 z-40">
      <Link href="/" className="text-2xl font-bold text-white hover:text-violet-400 transition">
        Trendz 🛍️
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/products" className="text-white font-medium hover:text-violet-400 transition">
          Products
        </Link>
        <Link href="/about" className="text-gray-200 hover:text-white transition">
          About
        </Link>
        <Link href="/contact" className="text-gray-200 hover:text-white transition">
          Contact
        </Link>
      </div>
    </nav>
  );
}
