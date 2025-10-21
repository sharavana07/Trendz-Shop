"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Download, Calendar, Package, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Navbar from "../../components/my_orders_navbar";

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

  const handleDownload = async (orderId: string) => {
    try {
      setDownloading(orderId);

      const res = await fetch(`/api/invoice/generate/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Invoice generation failed:", errText);
        alert("Failed to generate invoice.");
        return;
      }

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return "bg-green-900/30 text-green-300 border border-green-700";
      case "pending":
        return "bg-yellow-900/30 text-yellow-300 border border-yellow-700";
      case "failed":
        return "bg-red-900/30 text-red-300 border border-red-700";
      default:
        return "bg-blue-900/30 text-blue-300 border border-blue-700";
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">No Orders Yet</h2>
          <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium transition"
          >
            Explore Products
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
  <>
      {/* Navbar should be outside the gradient wrapper */}
      <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-gray-400">Track and manage your purchases</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-violet-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Order ID</p>
                      <p className="text-lg font-mono font-semibold text-white break-all">
                        {order.order_id}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.payment_status)}`}>
                      {getStatusIcon(order.payment_status)}
                      <span>{order.payment_status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                        <p className="text-sm text-white font-medium">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Items</p>
                        <p className="text-sm text-white font-medium">{order.total_items}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                        <p className="text-sm text-white font-medium">₹{order.total_price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                      <p className="text-sm text-white font-medium">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                  <Link
                    href={`/order-summary/${order.order_id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200 group/link"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    onClick={() => handleDownload(order.order_id)}
                    disabled={downloading === order.order_id}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    {downloading === order.order_id ? "Generating..." : "Invoice"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
  );
}