"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import CartNavbar from "@/components/CartNavbar";
import { ShoppingCart, Trash2, Plus, Minus, AlertCircle, CheckCircle, Loader } from "lucide-react";

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
    if (status === "loading") return;
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

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  if ((status as string) === "loading") {
    return (
      <div className="min-h-screen p-10 bg-gradient-to-br from-black via-slate-900 to-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-violet-500" />
          <p className="text-lg">Loading session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white">
      <CartNavbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        

        {cartItems.length === 0 && !orderSummary ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingCart className="w-20 h-20 text-gray-600 mb-6 opacity-50" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-300">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Add some items to get started!</p>
            <a href="/shop" className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-xl font-semibold transition">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-700 last:border-b-0 hover:bg-slate-750 transition-colors duration-200"
                  >
                    {/* Product Image & Info */}
                    <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0 flex-1">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="object-cover rounded-lg shadow-md"
                          unoptimized
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                          No Image
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-white truncate">{item.name}</h3>
                        <p className="text-violet-400 font-bold mt-1">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Quantity Controls & Total */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="flex items-center gap-2 bg-slate-700 rounded-lg p-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-600 rounded-md transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-600 rounded-md transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <p className="text-sm text-gray-400">Subtotal</p>
                        <p className="text-lg font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-lg transition flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gradient-to-br from-violet-900/40 to-slate-900/40 border border-violet-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tax</span>
                    <span>₹0</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-violet-400">₹{totalPrice.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || !cartLoaded || cartItems.length === 0 || (status as string) === "loading"}
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>

                {message && (
                  <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
                    message.startsWith("✅")
                      ? "bg-green-500/10 border border-green-500/30 text-green-300"
                      : "bg-red-500/10 border border-red-500/30 text-red-300"
                  }`}>
                    {message.startsWith("✅") ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm">{message.replace(/[❌✅]/g, "").trim()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Summary Display */}
        {orderSummary && (
          <div className="mt-12 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <h2 className="text-2xl font-bold text-green-300">Order Confirmed!</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Order Details</h3>
                <div className="space-y-3">
                  {orderSummary.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-gray-300">{item.name} × {item.quantity}</span>
                      <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Order Total</p>
                  <p className="text-3xl font-bold text-emerald-400">₹{orderSummary.total.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Order ID</p>
                  <p className="text-xl font-mono font-bold text-violet-300">{orderSummary.orderId}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}