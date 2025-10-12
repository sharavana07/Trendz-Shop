// /src/app/api/checkout/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const client = await db.connect();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("📦 Checkout body received:", body);

    const cartItems = Array.isArray(body?.items) ? body.items : [];
    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate fields
    for (const item of cartItems) {
      if (!item.id || !item.quantity || !item.price) {
        console.warn("❌ Invalid item:", item);
        return NextResponse.json({ error: "Invalid cart item format" }, { status: 400 });
      }
    }

    // calculate total price server-side
    const totalPrice = cartItems.reduce(
      (sum: number, item: { quantity: number; price: number; }) => sum + item.quantity * item.price,
      0
    );

    // find user id
    const userRes = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [session.user.email]
    );
    if (userRes.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = userRes.rows[0].id;

    // start transaction
    await client.query("BEGIN");

    // insert order
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id`,
      [userId, totalPrice]
    );
    const orderId = orderRes.rows[0].id;

    // insert order items
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)`,
        [orderId, item.id, item.quantity, item.price]
      );
    }

    await client.query("COMMIT");

    console.log("✅ Order saved:", { orderId, totalPrice });

    return NextResponse.json({ success: true, orderId, totalPrice });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  } finally {
    client.release();
  }
}
