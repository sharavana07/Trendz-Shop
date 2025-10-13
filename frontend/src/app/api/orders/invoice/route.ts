
// File: frontend/src/app/api/orders/invoice/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔁 Forward to FastAPI backend
    const res = await fetch("http://127.0.0.1:8000/generate-invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return new NextResponse(errorText, { status: res.status });
    }

    // 📄 Stream PDF back to client browser
    const arrayBuffer = await res.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice_${body.order_id}.pdf`,
      },
    });
  } catch (err) {
    console.error("Invoice proxy error:", err);
    return NextResponse.json(
      { error: "Failed to connect to backend for invoice" },
      { status: 500 }
    );
  }
}

