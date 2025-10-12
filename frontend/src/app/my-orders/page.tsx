"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ✅ Define a TypeScript interface for an Order
interface Order {
  order_id: string;
  created_at: string;
  total_items: number;
  total_price: number;
  payment_status: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/orders/user");
      const data = await res.json();
      setOrders(data.orders || []);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading your orders...</p>;

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
                <p>
                  <strong>Order ID:</strong> {order.order_id}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Items:</strong> {order.total_items}
                </p>
                <p>
                  <strong>Total:</strong> ₹{order.total_price}
                </p>
                <p>
                  <strong>Status:</strong> {order.payment_status}
                </p>
              </div>
              <Link
                href={`/order-summary/${order.order_id}`}
                className="text-violet-400 underline hover:text-violet-300"
              >
                View Details →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
