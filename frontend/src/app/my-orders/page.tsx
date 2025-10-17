"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  order_id: string;
  created_at: string;
  total_items: number;
  total_price: number;
  payment_status: string;
  user_name?: string;
  user_email?: string;
  items?: OrderItem[];
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Fetch all orders for user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/user");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Download invoice
  const handleDownload = async (orderId: string) => {
    try {
      setDownloading(orderId);

      // Directly call backend PDF generation route
      const res = await fetch(`/api/invoice/generate/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}) // empty body or send extra info if needed
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Invoice generation failed:", errText);
        alert("Failed to generate invoice.");
        return;
      }

      // Download PDF
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${orderId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Error downloading invoice:", err);
      alert("Error downloading invoice");
    } finally {
      setDownloading(null);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading your orders...</p>;

  if (orders.length === 0)
    return (
      <div className="text-center mt-10 text-gray-400">
        <p>No orders yet 🛍️</p>
        <Link href="/products" className="text-violet-400 underline">
          Start Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 text-white bg-gray-900 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <ul className="space-y-5">
        {orders.map((order) => (
          <li
            key={order.order_id}
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p><strong>Order ID:</strong> {order.order_id}</p>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                <p><strong>Items:</strong> {order.total_items}</p>
                <p><strong>Total:</strong> ₹{order.total_price}</p>
                <p><strong>Status:</strong> {order.payment_status}</p>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <Link
                  href={`/order-summary/${order.order_id}`}
                  className="text-violet-400 underline hover:text-violet-300"
                >
                  View Details →
                </Link>

                <button
                  onClick={() => handleDownload(order.order_id)}
                  disabled={downloading === order.order_id}
                  className="px-3 py-1 bg-violet-500 hover:bg-violet-600 rounded text-sm font-medium disabled:opacity-50"
                >
                  {downloading === order.order_id ? "Downloading..." : "Download Invoice"}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
