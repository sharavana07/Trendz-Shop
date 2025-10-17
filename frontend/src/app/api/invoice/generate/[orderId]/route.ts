import { NextResponse } from "next/server";

export async function POST(req: Request, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params; // 👈 await this!

  try {
    const res = await fetch(`http://127.0.0.1:8000/invoice/generate/${orderId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Invoice generation failed:", errText);
      return NextResponse.json(
        { error: "Failed to generate invoice", details: errText },
        { status: res.status }
      );
    }

    const pdfBuffer = await res.arrayBuffer();
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice_${orderId}.pdf`,
      },
    });
  } catch (error) {
    console.error("Error calling FastAPI invoice endpoint:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}
