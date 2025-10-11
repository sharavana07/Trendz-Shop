"use client";

import { useEffect, useState } from "react";
import CartNavbar from "@/components/CartNavbar";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          total_price: totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Checkout failed");

      setMessage("✅ Order placed successfully!");
      localStorage.removeItem("cart");
      setCartItems([]);
    } catch (err: unknown) {
      console.error("Checkout error:", err);
      setMessage("❌ " + (err instanceof Error ? err.message : "An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-black text-white">
      <CartNavbar />
      <h1 className="text-3xl font-bold mb-6">🛍️ Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty 🛒</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-gray-900 p-4 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-400">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-right">
            <p className="text-xl mb-3">Total: ₹{totalPrice}</p>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-xl font-semibold text-white transition"
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
            {message && (
              <p className={`mt-4 ${message.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>
                {message}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
