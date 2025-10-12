
// frontend/src/app/order-summary/[id]/page.tsx

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";

interface OrderSummaryProps {
  params: {
    id: string;
  };
}

export default async function OrderSummaryPage({ params }: OrderSummaryProps) {
  const { id } = params;

  // Fetch order details + linked user email
  const orderRes = await db.query(
    `
    SELECT o.id, o.total_price, o.payment_status, o.created_at, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = $1
    `,
    [id]
  );

  if (orderRes.rowCount === 0) return notFound();
  const order = orderRes.rows[0];

  // Fetch ordered items
  const itemsRes = await db.query(
    `
    SELECT p.name, oi.quantity, oi.unit_price::float AS price
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
    `,
    [id]
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full bg-[#1a1a1a] p-6 rounded-2xl shadow-xl border border-violet-600">
        <h1 className="text-2xl font-bold mb-4 text-center text-violet-400">
          Order Summary
        </h1>

        <div className="space-y-3 text-gray-200">
          <p>
            <span className="font-semibold text-white">Order ID:</span> #{order.id}
          </p>
          <p>
            <span className="font-semibold text-white">Email:</span> {order.email}
          </p>
          <p>
            <span className="font-semibold text-white">Payment Status:</span>{" "}
            <span className={order.payment_status === "Paid" ? "text-green-400" : "text-yellow-400"}>
              {order.payment_status}
            </span>
          </p>
          <p>
            <span className="font-semibold text-white">Date:</span>{" "}
            {format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}
          </p>
        </div>

        {/* Product list */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-violet-400 mb-2">Items:</h2>
          <ul className="space-y-2">
            {itemsRes.rows.map((item: { name: string; quantity: number; price: number }, index: number) => (
              <li key={index} className="flex justify-between text-gray-300">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <hr className="my-4 border-gray-700" />
        <p className="text-right font-semibold text-white">
          Total: ₹{order.total_price}
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/products"
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
