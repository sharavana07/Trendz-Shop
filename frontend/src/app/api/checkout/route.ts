import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const client = await db.connect();

  try {
    // ✅ Step 1: Check authentication
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if (!userEmail) {
      console.warn("⚠️ Unauthorized checkout attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Step 2: Parse and validate body
    const body = await req.json();
    console.log("📦 Checkout request body:", body);

    const cartItems = Array.isArray(body?.items) ? body.items : [];
    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // ✅ Step 3: Validate item structure
    for (const [index, item] of cartItems.entries()) {
      if (
        typeof item.id !== "number" ||
        typeof item.quantity !== "number" ||
        typeof item.price !== "number" ||
        item.quantity <= 0 ||
        item.price < 0
      ) {
        console.error(`❌ Invalid item at index ${index}:`, item);
        return NextResponse.json({ error: "Invalid cart item format" }, { status: 400 });
      }
    }

    // ✅ Step 4: Compute total price on server-side
    const totalPrice = cartItems.reduce(
      (sum: number, item: { quantity: number; price: number }) => sum + item.quantity * item.price,
      0
    );

    // ✅ Step 5: Find user ID
    const userRes = await client.query(
      `SELECT id FROM users WHERE email = $1 LIMIT 1`,
      [userEmail]
    );
    if (userRes.rowCount === 0) {
      console.error("❌ User not found:", userEmail);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userRes.rows[0].id;

    // ✅ Step 6: Begin transaction
    await client.query("BEGIN");

    // ✅ Step 7: Insert into orders table
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_price, payment_status) 
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
      [userId, totalPrice, "Pending"]
    );
    const { id: orderId, created_at: createdAt } = orderRes.rows[0];

    // ✅ Step 8: Insert all order items
    const insertPromises = cartItems.map((item: { id: unknown; quantity: unknown; price: unknown; }) =>
      client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.id, item.quantity, item.price]
      )
    );
    await Promise.all(insertPromises);

    // ✅ Step 9: Commit the transaction
    await client.query("COMMIT");

    console.log("✅ Order successfully created:", {
      orderId,
      userId,
      totalPrice,
      createdAt,
    });

    // ✅ Step 10: Send success response
    return NextResponse.json(
      {
        success: true,
        message: "Order successfully created",
        order: { orderId, totalPrice, createdAt },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Rollback on any error
    await client.query("ROLLBACK");

    console.error("❌ Checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error";

    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    // Always release connection
    client.release();
  }
}
