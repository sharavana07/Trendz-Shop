"use client";

import React from "react";
import { useCart } from "../context/CartContext";

interface Props {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function AddToCartButton({ id, name, price, image }: Props) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() =>
        addToCart({ id, name, price, image, quantity: 1 })
      }
      className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg shadow-md transition"
    >
      🛒 Add to Cart
    </button>
  );
}
