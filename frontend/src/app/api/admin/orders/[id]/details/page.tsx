import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const result = await db.query(
      `
      SELECT 
        p.name AS product_name,
        oi.quantity,
        oi.unit_price,
        (oi.quantity * oi.unit_price) AS subtotal
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      `,
      [id]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Error fetching order details:", err);
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
  }
}
