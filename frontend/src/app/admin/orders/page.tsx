    "use client";
    import { useEffect, useState } from "react";

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



    if (loading) return <div className="p-6 text-white">Loading orders...</div>;

    return (
        <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">All Orders</h1>

        <table className="w-full border border-gray-600 text-sm">
            <thead>
            <tr className="bg-gray-800">
                <th className="p-2">Order ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
            </tr>
            </thead>
            <tbody>
            {orders.map((o) => (
                <tr key={o.id} className="border-t border-gray-700">
                <td className="p-2">{o.id}</td>
                <td className="p-2">{o.username || "Guest"}</td>
                <td className="p-2">₹{o.total_price}</td>
                <td className="p-2">
                    <span
                    className={`px-2 py-1 rounded text-sm ${
                        o.status === "Pending"
                        ? "bg-yellow-500"
                        : o.status === "Shipped"
                        ? "bg-blue-500"
                        : "bg-green-600"
                    }`}
                    >
                    {o.status}
                    </span>
                </td>
                <td className="p-2">
                    {o.status !== "Delivered" && (
                    <button
                        onClick={() => updateStatus(o.id, nextStatus(o.status))}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                    >
                        Mark as {nextStatus(o.status)}
                    </button>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    }
