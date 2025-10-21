"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, User, ShoppingCart, Home, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left - Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Trendz</span>
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-6 text-purple-300">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Products</span>
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
        </div>

        {/* Mobile Menu Button - Visible only on mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-purple-300 hover:text-white transition-colors p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu - Slides down when open */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 space-y-3 bg-black/60 backdrop-blur-md border-t border-purple-500/20">
          <Link
            href="/"
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors py-2"
            onClick={closeMenu}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors py-2"
            onClick={closeMenu}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Products</span>
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors py-2"
            onClick={closeMenu}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors py-2"
            onClick={closeMenu}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}