"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CartNavbar from "@/components/CartNavbar";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
}

interface OrderSummary {
  items: CartItem[];
  total: number;
  orderId: number;
}

interface CheckoutPayloadItem {
 id: number;
 quantity: number;
price: number;
}

interface CheckoutResponse {
  orderId?: number;
  id?: number;
  totalPrice?: number;
  total?: number;
  message?: string;
  error?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  // ✅ Load cart from localStorage once on mount
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const normalized: CartItem[] = parsed.map((p: Record<string, unknown>) => ({
            id: Number(p.id),
            name: String(p.name),
            price: Number(p.price),
            quantity: Number(p.quantity) || 1,
            image_url: typeof p.image_url === "string" ? p.image_url : undefined,
          }));
          setCartItems(normalized);
        } else {
          console.warn("localStorage.cart not an array — clearing it", parsed);
          localStorage.removeItem("cart");
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } catch (e) {
      console.error("Error parsing localStorage cart:", e);
      localStorage.removeItem("cart");
      setCartItems([]);
    } finally {
      setCartLoaded(true);
    }
  }, []);

  // ✅ Sync cart → localStorage whenever cartItems changes
  useEffect(() => {
    if (!cartLoaded) return;
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Error saving cart to localStorage:", e);
    }
  }, [cartItems, cartLoaded]);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ✅ Checkout handler
  const handleCheckout = async () => {
    if (!cartLoaded) {
      setMessage("❌ Cart not ready yet. Try again in a moment.");
      return;
    }

    if (cartItems.length === 0) {
      setMessage("❌ Your cart is empty");
      return;
    }

    const payloadItems: CheckoutPayloadItem[] = cartItems.map(item => ({
      id: item.id,
            quantity: item.quantity, price: item.price,
    }));

    console.log("Cart items on checkout:", payloadItems);
    console.log("Checkout payload:", payloadItems);

    try {
      setLoading(true);
      setMessage("");
      setOrderSummary(null);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: payloadItems }),
      });

      let data: CheckoutResponse;

      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Non-JSON response from /api/checkout:", text);
        throw new Error("Non-JSON response from server");
      }

      if (!res.ok) {
        const errMsg = data?.message ?? data?.error ?? "Checkout failed";
        throw new Error(errMsg);
      }

      const orderId = data.orderId ?? data.id ?? null;
      const serverTotal = data.totalPrice ?? data.total ?? totalPrice;

      setMessage(`✅ Order placed successfully! Order ID: ${orderId ?? "N/A"}`);
      setOrderSummary({
        items: cartItems,
        total: serverTotal,
        orderId: orderId ?? -1,
      });

      localStorage.removeItem("cart");
      setCartItems([]);
    } catch (err) {
      console.error("Checkout error:", err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setMessage("❌ " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-black text-white">
      <CartNavbar />

      <h1 className="text-3xl font-bold mb-6">🛍️ Your Cart</h1>

      {!cartLoaded ? (
        <p>Loading cart…</p>
      ) : cartItems.length === 0 && !orderSummary ? (
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
                      unoptimized
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
              disabled={loading || !cartLoaded || cartItems.length === 0}
              className="bg-violet-600 disabled:opacity-50 hover:bg-violet-700 px-6 py-3 rounded-xl font-semibold text-white transition"
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
