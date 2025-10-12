"use client";

import { useState } from "react";

export default function CheckoutButton({ totalPrice }: { totalPrice: number }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalPrice }),
        credentials: "include", // ✅ VERY IMPORTANT to send session cookie
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + data.error);
        setLoading(false);
        return;
      }

      alert("Order placed! Order ID: " + data.orderId);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return <button onClick={handleCheckout} disabled={loading}>Checkout</button>;
}
