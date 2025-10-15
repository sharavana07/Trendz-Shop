// /src/app/api/checkout/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const client = await db.connect(); // get client for transaction
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { cartItems } = body; // expect cartItems = [{ id, quantity, price }, ...]
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // calculate total price server-side
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
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

    return NextResponse.json({ success: true, orderId, totalPrice });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  } finally {
    client.release();
  }
}
