import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const res = await db.query(`
      SELECT 
        o.id, 
        o.payment_status AS status, 
        u.name AS username,  -- map 'name' to 'username'
        o.total_price, 
        o.created_at
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    return NextResponse.json(res.rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
