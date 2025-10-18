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
  const [imageError, setImageError] = useState(false);
  const originalPrice = Number((product.price * 1.2).toFixed(2));
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <article
      className="group relative bg-white/5 hover:bg-white/8 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-purple-500/25 hover:scale-105 border border-white/10 hover:border-purple-500/30 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const btn = e.currentTarget.querySelector('button');
          btn?.click();
        }
      }}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/30 via-indigo-500/20 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl animate-pulse" />

      {/* Content wrapper */}
      <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 h-full flex flex-col">
        
        {/* Image container */}
        <div className="relative overflow-hidden rounded-xl mb-4 aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0">
          {/* Loading shimmer */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer" />
          )}

          {/* Image */}
          <img
            src={imageError ? "/placeholder.png" : product.image_url || "/placeholder.png"}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            } group-hover:scale-115`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageLoaded(true);
              setImageError(true);
            }}
            loading="lazy"
          />

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-lg transform -translate-x-16 group-hover:translate-x-0 transition-transform duration-300">
              -{discount}%
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-lg transform translate-x-20 group-hover:translate-x-0 transition-transform duration-300">
            {product.category}
          </div>
        </div>

        {/* Content section - grows to fill space */}
        <div className="space-y-3 flex-grow flex flex-col">
          
          {/* Product name */}
          <h3
            className={`text-lg sm:text-xl font-bold transition-all duration-300 line-clamp-2 ${
              isHovered
                ? "bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent"
                : "text-white"
            }`}
          >
            {product.name}
          </h3>

          {/* Price section */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Description - flexible height */}
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-2 group-hover:line-clamp-3 transition-all duration-300 flex-grow">
            {product.description}
          </p>

          {/* Action button */}
          <button
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-2 group/btn"
            aria-label={`Add ${product.name} to cart`}
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Corner accent light */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </article>
  );
}