"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, LogOut, Menu, X, Home } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Products", href: "/products", icon: <ShoppingBag className="w-4 h-4" /> },
    { name: "My Orders", href: "/my-orders", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-gray-900/70 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-violet-400 tracking-wide hover:text-violet-300 transition">
          Trendz<span className="text-white">Shop</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-1.5 text-sm font-medium transition ${
                pathname === link.href
                  ? "text-violet-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side (User / Logout) */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              <p className="text-sm text-gray-300">
                Hi, <span className="font-medium text-white">{session.user?.name?.split(" ")[0]}</span>
              </p>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-md transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-md transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-300 hover:text-white transition"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 py-3 space-y-3 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 text-sm font-medium transition ${
                pathname === link.href
                  ? "text-violet-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}

          <div className="border-t border-gray-800 pt-3">
            {session ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut();
                }}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-red-400 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-violet-400 hover:text-violet-300 font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
