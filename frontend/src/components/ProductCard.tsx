"use client";
// src/componets/ProductCard.tsx
import { useState } from "react";

type Product = {
  image_url?: string;
  name: string;
  category: string;
  price: number;
  description: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-1 shadow-2xl transition-all duration-500 hover:shadow-purple-500/20 hover:scale-[1.02] border border-white/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

      <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md rounded-3xl p-5 h-full">
        {/* Image container with overlay */}
        <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/3]">
          {/* Shimmer loading effect */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
          )}

          <img
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          <div className="absolute top-3 right-3 bg-purple-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg transform translate-x-20 group-hover:translate-x-0 transition-transform duration-300">
            {product.category}
          </div>
        </div>

        {/* Content section */}
        <div className="space-y-2">
          {/* Product name with gradient on hover */}
          <h3
            className={`text-xl font-bold transition-all duration-300 ${
              isHovered
                ? "bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
                : "text-white"
            }`}
          >
            {product.name}
          </h3>

          {/* Price with stylized design */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              ₹{product.price}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ₹{(product.price * 1.2).toFixed(2)}
            </span>
          </div>

          {/* Description with fade effect */}
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {product.description}
          </p>

          {/* Action button */}
          <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2">
            <span>Add to Cart</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}