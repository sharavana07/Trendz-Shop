"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartNavbar() {
  const { cart } = useCart();

  // total quantity across all items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 bg-gradient-to-r from-[#111827] via-[#1F2937] to-[#111827] backdrop-blur-xl shadow-2xl border-b border-white/10">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Brand Name */}
        <Link
          href="/"
          className="group relative text-white text-xl sm:text-2xl font-bold tracking-tight transition-all duration-300 hover:scale-105"
          aria-label="Trendz-Shop Home"
        >
          <span className="relative z-10 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent group-hover:from-[#7C3AED] group-hover:via-purple-400 group-hover:to-[#7C3AED] transition-all duration-300">
            Trendz-Shop
          </span>
          <span className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-30 bg-gradient-to-r from-[#7C3AED] to-indigo-500 transition-opacity duration-300" aria-hidden="true"></span>
        </Link>

        {/* Right: Cart */}
        <Link
          href="/cart"
          className="group relative flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#7C3AED]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/20 hover:scale-105"
          aria-label={`Shopping cart with ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
        >
          {/* Cart Icon with Animation */}
          <span className="text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" aria-hidden="true">
            🛒
          </span>
          
          {/* Cart Text - Hidden on Mobile */}
          <span className="hidden sm:inline text-[#F9FAFB] font-medium text-sm group-hover:text-white transition-colors duration-300">
            Cart
          </span>

          {/* Badge */}
          {totalItems > 0 && (
            <span 
              className="absolute -top-2 -right-2 flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-indigo-500 rounded-full shadow-lg shadow-[#7C3AED]/50 animate-pulse"
              aria-label={`${totalItems} items in cart`}
            >
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}

          {/* Hover Glow Effect */}
          <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#7C3AED]/10 to-indigo-500/10 blur-xl transition-opacity duration-300" aria-hidden="true"></span>
        </Link>
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#7C3AED]/50 to-transparent" aria-hidden="true"></div>
    </nav>
  );
}