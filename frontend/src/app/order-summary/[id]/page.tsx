// frontend/src/app/order-summary/[id]/page.tsx

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { Check, Package, Calendar, Mail, Hash } from "lucide-react";

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

  const isPaid = order.payment_status === "Paid";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Success banner */}
      {isPaid && (
        <div className="mb-6 w-full max-w-lg flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-300">Payment received successfully</p>
        </div>
      )}

      {/* Main card */}
      <div className="w-full max-w-lg">
        {/* Header section */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-t-2xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-white text-center">Order Complete</h1>
          <p className="text-violet-100 text-center mt-2 text-sm">Thank you for your purchase</p>
        </div>

        {/* Content section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-b-2xl p-6 sm:p-8 space-y-6">
          
          {/* Order details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Order ID */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Order ID</span>
              </div>
              <p className="text-lg font-mono font-semibold text-white">{order.id}</p>
            </div>

            {/* Payment Status */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Payment Status</span>
              </div>
              <p className={`text-lg font-semibold ${isPaid ? "text-green-400" : "text-amber-400"}`}>
                {order.payment_status}
              </p>
            </div>

            {/* Email */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 sm:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</span>
              </div>
              <p className="text-base font-medium text-slate-200 break-all">{order.email}</p>
            </div>

            {/* Order Date */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 sm:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Order Date</span>
              </div>
              <p className="text-base font-medium text-slate-200">
                {format(new Date(order.created_at), "EEEE, dd MMMM yyyy · hh:mm a")}
              </p>
            </div>
          </div>

          {/* Items section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">Order Items</h2>
            </div>

            <div className="bg-slate-700/20 rounded-lg divide-y divide-slate-600/50">
              {itemsRes.rows.map((item: { name: string; quantity: number; price: number }, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-100 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-slate-400">@ ₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total section */}
          <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-lg p-4 flex justify-between items-center">
            <span className="text-slate-300 font-semibold">Order Total</span>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
              ₹{parseFloat(order.total_price).toFixed(2)}
            </span>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <Link
              href="/products"
              className="w-full inline-block text-center px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 active:scale-95 shadow-lg hover:shadow-violet-500/25"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Support info */}
          <p className="text-center text-xs text-slate-400 pt-2">
            A confirmation email has been sent to <span className="text-slate-300">{order.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}