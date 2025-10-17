import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  // ✅ Call the actual FastAPI backend
  const res = await fetch(`http://127.0.0.1:8000/invoice/generate/${orderId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Invoice generation error:", errorText);
    return NextResponse.json(
      { error: "Failed to generate invoice", detail: errorText },
      { status: res.status }
    );
  }

  // 🧾 Return PDF
  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice_${orderId}.pdf`,
    },
  });
}
