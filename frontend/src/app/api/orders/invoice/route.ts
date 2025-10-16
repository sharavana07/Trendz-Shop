
// File: frontend/src/app/api/orders/invoice/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch("http://127.0.0.1:8000/generate-invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const arrayBuffer = await res.arrayBuffer();
  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice_${body.order_id}.pdf`,
    },
  });
}

