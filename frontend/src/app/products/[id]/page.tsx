import Image from "next/image";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { Heart, Share2, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  created_at?: string;
}

interface ProductDetailProps {
  params: { id: string };
}

export default async function ProductDetail({ params }: ProductDetailProps) {
  const { id } = await params;
  if (!id) notFound();

  let product: Product | null = null;
  try {
    const result = await db.query<Product>("SELECT * FROM products WHERE id = $1", [id]);
    if (!result.rows.length) notFound();
    product = result.rows[0];
  } catch (error) {
    console.error("Database query error:", error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-violet-500/20 backdrop-blur-sm sticky top-0 z-40 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/products" 
            className="flex items-center gap-2 text-violet-300 hover:text-violet-100 transition-colors"
            aria-label="Back to products"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="text-xs text-violet-400/60 uppercase tracking-wider">{product?.category}</div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-violet-900/40 to-slate-900/40 border border-violet-500/20 shadow-2xl group">
              {product?.image_url ? (
                <>
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700/50 to-gray-900/50 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-6xl text-gray-600 mb-2">📦</div>
                    <span className="text-gray-400 text-sm">No Image Available</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons Under Image */}
            <div className="flex gap-3 mt-6 w-full">
              <button
                className="flex-1 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:border-violet-400/50 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                aria-label="Add to wishlist"
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:border-violet-400/50 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Title and Category */}
            <div className="space-y-3">
              <div className="inline-block">
                <span className="text-xs font-semibold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                  {product?.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                {product?.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-violet-500">
                ₹{product?.price?.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400">Inclusive of all taxes</span>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-violet-500/20 via-violet-500/40 to-violet-500/20" />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Description
              </h3>
              <p className="text-base text-gray-300 leading-relaxed">
                {product?.description}
              </p>
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/10">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">SKU</p>
                <p className="text-sm font-semibold text-gray-200 mt-1">#{product?.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                <p className="text-sm font-semibold text-gray-200 mt-1">{product?.category}</p>
              </div>
            </div>

            {/* Add to Cart Button */}
            {product && (
              <div className="pt-4">
                <AddToCartButton
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image_url}
                />
              </div>
            )}

            {/* Trust Indicators */}
            <div className="pt-4 space-y-3 border-t border-violet-500/10">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-green-400">✓</span>
                </div>
                <span className="text-sm text-gray-300">In stock & ready to ship</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-green-400">✓</span>
                </div>
                <span className="text-sm text-gray-300">30-day return policy</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-green-400">✓</span>
                </div>
                <span className="text-sm text-gray-300">Secure checkout & payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}