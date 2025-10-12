"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CartNavbar from "@/components/CartNavbar";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface OrderSummary {
  items: CartItem[];
  total: number;
  orderId: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setMessage("❌ Your cart is empty");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setOrderSummary(null);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Checkout failed");

      // Show success message
      setMessage(`✅ Order placed successfully! Order ID: ${data.orderId}`);

      // Show summary of items in the order
      setOrderSummary({
        items: cartItems,
        total: data.totalPrice,
        orderId: data.orderId,
      });

      // Clear cart after successful checkout
      localStorage.removeItem("cart");
      setCartItems([]);
    } catch (err: unknown) {
      console.error("Checkout error:", err);
      setMessage(
        "❌ " + (err instanceof Error ? err.message : "An error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-black text-white">
      <CartNavbar />

      <h1 className="text-3xl font-bold mb-6">🛍️ Your Cart</h1>

      {cartItems.length === 0 && !orderSummary ? (
        <p>Your cart is empty 🛒</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map(item => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-gray-900 p-4 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-4">
                  {item.image_url ? (
  <Image
    src={item.image_url}
    alt={item.name}
    width={64}
    height={64}
    className="object-cover rounded-lg"
    unoptimized // because it's an external URL
  />
) : (
  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-sm text-gray-300">
    No Image
  </div>
)}

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
              <p
                className={`mt-4 ${
                  message.startsWith("✅") ? "text-green-400" : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </>
      )}

      {orderSummary && (
        <div className="mt-10 bg-gray-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <ul className="space-y-2">
            {orderSummary.items.map(item => (
              <li key={item.id}>
                {item.name} x {item.quantity} = ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-semibold">Total: ₹{orderSummary.total}</p>
          <p className="text-gray-400">Order ID: {orderSummary.orderId}</p>
        </div>
      )}
    </div>
  );
}
