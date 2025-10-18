"use client";


import { useState, useEffect } from 'react';
import { ShoppingBag, Star, Zap } from 'lucide-react';

type Product = {
  id: string | number;
  name: string;
  price: number;
  image_url: string;
};

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);

  useEffect(() => {
    async function getProducts() {
      try {
        const res = await fetch("http://localhost:8000/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-black/30 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Collections</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-300">
            <Zap className="w-4 h-4" />
            <span>Trending Now</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">Discover Our Products</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-700/50 rounded-2xl h-48 mb-4"></div>
                <div className="bg-slate-700/50 rounded h-4 w-3/4 mb-2"></div>
                <div className="bg-slate-700/50 rounded h-4 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <a
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/20 rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 h-full flex flex-col"
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-slate-800">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badge */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    
                    <div className="mt-auto">
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/products/${product.id}`;
                      }}
                      className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all duration-300 transform group-hover:shadow-lg group-hover:shadow-purple-500/30 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-purple-400/40 mx-auto mb-4" />
            <p className="text-xl text-purple-300">No products found.</p>
            <p className="text-sm text-purple-400 mt-2">Check back soon for new items!</p>
          </div>
        )}
      </main>
    </div>
  );
}