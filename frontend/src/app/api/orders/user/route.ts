import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Find the user ID
    const userRes = await db.query("SELECT id FROM users WHERE email = $1", [
      session.user.email,
    ]);

    if (userRes.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userRes.rows[0].id;

    // ✅ Fetch all orders + joined item summary
    const ordersRes = await db.query(
      `
      SELECT 
        o.id AS order_id,
        o.total_price,
        o.payment_status,
        o.created_at,
        COUNT(oi.id) AS total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC;
      `,
      [userId]
    );

    return NextResponse.json({ orders: ordersRes.rows });
  } catch (err) {
    console.error("Fetch user orders error:", err);
    return NextResponse.json(
      { error: "Failed to fetch user orders" },
      { status: 500 }
    );
  }
}
