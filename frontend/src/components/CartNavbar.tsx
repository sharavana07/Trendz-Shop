"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartNavbar() {
  const { cart } = useCart();

  // total quantity across all items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed top-4 right-4 z-50 bg-black/70 backdrop-blur-lg px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3">
      <Link href="/cart" className="flex items-center gap-2 text-white hover:text-violet-400 transition">
        <span className="text-xl">🛒</span>
        {totalItems > 0 && (
          <span className="text-sm font-semibold bg-violet-600 px-2 py-0.5 rounded-full">
            {totalItems}
          </span>
        )}
      </Link>
    </nav>
  );
}
