import { NextResponse } from "next/server";
import { Pool } from "pg";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

//src/app/api/orders/route.ts

// ✅ Connect to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, total_price } = await req.json();
    if (!items || !total_price) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const user_id = session.user.id;

    const result = await pool.query(
      `INSERT INTO orders (user_id, items, total_price)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, JSON.stringify(items), total_price]
    );

    return NextResponse.json({ message: "Order placed!", order: result.rows[0] });
  } catch (err) {
    console.error("Error creating order:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_id = session.user.id;
    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
