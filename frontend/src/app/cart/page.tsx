"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
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
  product_id: number;
  quantity: number;
  unit_price: number;
}

interface CheckoutPayload {
  user_id: number;
  items: CheckoutPayloadItem[];
  total_price: number;
}

interface CheckoutResponse {
  order_id?: number;
  message?: string;
  error?: string;
}

interface StoredCartItem {
  id: number | string;
  name: string;
  price: number | string;
  quantity?: number | string;
  image_url?: string;
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  // Load cart from localStorage
  useEffect(() => {
     console.log("CartPage session:", session, "status:", status);  
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
      if (stored) {
        const parsed: StoredCartItem[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(
            parsed.map((p) => ({
              id: Number(p.id),
              name: String(p.name),
              price: Number(p.price),
              quantity: Number(p.quantity) || 1,
              image_url: typeof p.image_url === "string" ? p.image_url : undefined,
            }))
          );
        }
      }
    } catch {
      localStorage.removeItem("cart");
      setCartItems([]);
    } finally {
      setCartLoaded(true);
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    console.log("CartPage session:", session, "status:", status);
    if (cartLoaded) localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems, cartLoaded]);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  console.log("Attempting checkout...");
console.log("userId:", session?.user?.id);
console.log("cartItems:", cartItems);
console.log("totalPrice:", totalPrice);

  const handleCheckout = async () => {
    if (status === "loading") return; // Wait for session
    const userId = session?.user?.id;
    if (!userId) {
      setMessage("❌ You must be logged in to checkout.");
      return;
    }
    if (!cartLoaded) {
      setMessage("❌ Cart not ready yet.");
      return;
    }
    if (cartItems.length === 0) {
      setMessage("❌ Your cart is empty.");
      return;
    }

    const payload: CheckoutPayload = {
      user_id: userId,
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      total_price: totalPrice,
    };

    
console.log("Checkout payload:", payload);

    try {
      setLoading(true);
      setMessage("");
      setOrderSummary(null);

      const res = await fetch("http://localhost:8000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: CheckoutResponse = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      setMessage(`✅ Order placed successfully! Order ID: ${data.order_id}`);
      setOrderSummary({ items: cartItems, total: totalPrice, orderId: data.order_id! });
      setCartItems([]);
      localStorage.removeItem("cart");
    } catch (err) {
      setMessage("❌ " + (err instanceof Error ? err.message : "Checkout failed"));
    } finally {
      setLoading(false);
    }
  };

  if ((status as string) === "loading") return <p>Loading session…</p>;

  return (
    <div className="min-h-screen p-10 bg-black text-white">
      <CartNavbar />
      <h1 className="text-3xl font-bold mb-6">🛍️ Your Cart</h1>

      {cartItems.length === 0 && !orderSummary ? (
        <p>Your cart is empty 🛒</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between bg-gray-900 p-4 rounded-xl shadow-lg">
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
              disabled={loading || !cartLoaded || cartItems.length === 0 || (status as string) === "loading"}
              className="bg-violet-600 disabled:opacity-50 hover:bg-violet-700 px-6 py-3 rounded-xl font-semibold text-white transition"
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
            {message && (
              <p className={`mt-4 ${message.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>
                {message}
              </p>
            )}
          </div>

          {orderSummary && (
            <div className="mt-10 bg-gray-900 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <ul className="space-y-2">
                {orderSummary.items.map((item) => (
                  <li key={item.id}>
                    {item.name} x {item.quantity} = ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-semibold">Total: ₹{orderSummary.total}</p>
              <p className="text-gray-400">Order ID: {orderSummary.orderId}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
