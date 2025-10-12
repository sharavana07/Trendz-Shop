import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { status } = await req.json();

    await db.query(
      `UPDATE orders SET payment_status = $1 WHERE id = $2`,
      [status, id]
    );

    return NextResponse.json({ message: "Order status updated" });
  } catch (err) {
    console.error("Error updating order:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
