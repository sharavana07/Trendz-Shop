import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await context.params; // ✅ await here

  try {
    // Forward request to FastAPI backend
    const res = await fetch(`http://127.0.0.1:8000/invoice/orders/${orderId}`);

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const order = await res.json();
    return NextResponse.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    return NextResponse.json(
      { error: "Failed to fetch order from backend" },
      { status: 500 }
    );
  }
}
