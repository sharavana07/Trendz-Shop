"use client";
import { useEffect, useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";

interface Order {
  id: number;
  username: string | null;
  total_price: number;
  status: "Pending" | "Shipped" | "Delivered";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: number, newStatus: Order["status"]) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const nextStatus = (current: Order["status"]): Order["status"] => {
    if (current === "Pending") return "Shipped";
    if (current === "Shipped") return "Delivered";
    return "Delivered";
  };

  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return {
          bg: "bg-amber-500/20",
          text: "text-amber-300",
          border: "border-amber-500/30",
          dot: "bg-amber-400",
        };
      case "Shipped":
        return {
          bg: "bg-blue-500/20",
          text: "text-blue-300",
          border: "border-blue-500/30",
          dot: "bg-blue-400",
        };
      case "Delivered":
        return {
          bg: "bg-emerald-500/20",
          text: "text-emerald-300",
          border: "border-emerald-500/30",
          dot: "bg-emerald-400",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-300 text-sm font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-violet-500 to-indigo-500 rounded-full"></div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Orders Management
            </h1>
          </div>
          <p className="text-slate-400 ml-4 text-sm">
            Track and manage customer orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Pending",
              value: orders.filter((o) => o.status === "Pending").length,
              color: "from-amber-500/20 to-amber-600/10",
            },
            {
              label: "Shipped",
              value: orders.filter((o) => o.status === "Shipped").length,
              color: "from-blue-500/20 to-blue-600/10",
            },
            {
              label: "Delivered",
              value: orders.filter((o) => o.status === "Delivered").length,
              color: "from-emerald-500/20 to-emerald-600/10",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} border border-white/10 rounded-2xl p-6 backdrop-blur-sm`}
            >
              <p className="text-slate-400 text-sm font-medium mb-2">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table Container */}
        <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden shadow-lg">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length > 0 ? (
                  orders.map((o, idx) => {
                    const statusConfig = getStatusConfig(o.status);
                    return (
                      <tr
                        key={o.id}
                        className="hover:bg-white/5 transition-colors duration-200"
                        role="row"
                      >
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">
                            #{o.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-300">
                            {o.username || "Guest"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-medium">
                            ₹{o.total_price.toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${statusConfig.dot}`}
                              aria-hidden="true"
                            ></div>
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                              role="status"
                              aria-label={`Order status: ${o.status}`}
                            >
                              {o.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {o.status !== "Delivered" && (
                            <button
                              onClick={() =>
                                updateStatus(o.id, nextStatus(o.status))
                              }
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                              aria-label={`Mark order ${o.id} as ${nextStatus(o.status)}`}
                            >
                              <span>
                                {nextStatus(o.status)}
                              </span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                          {o.status === "Delivered" && (
                            <span className="text-slate-500 text-sm font-medium">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <p className="text-slate-400 text-sm">
                        No orders found
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-slate-400 text-sm">
          Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}