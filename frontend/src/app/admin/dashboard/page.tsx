"use client";

// frontend/src/app/admin/dashboard/page.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import ProtectedAdminRoute from "../../../components/ProtectedAdminRoute";
import { Plus, Edit2, Trash2, Package, AlertCircle } from "lucide-react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/products/");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const lowStockCount = products.filter((p) => p.stock < 5).length;

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4 inline-block">
            <Package className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-gray-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header Section */}
        <div className="z-40 backdrop-blur-xl bg-white/5 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400 text-sm mt-2">
                  Manage your product inventory and catalog
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/admin/add-product" className="w-full sm:w-auto">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Button>
                </Link>
                <Link href="/admin/edit-product" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 rounded-lg transition-all duration-200 font-semibold"
                  >
                    Manage Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group backdrop-blur-lg bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-6 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">
                    Total Products
                  </p>
                  <p className="text-4xl font-bold text-white mt-2">
                    {products.length}
                  </p>
                </div>
                <Package className="w-12 h-12 text-purple-400/40 group-hover:text-purple-400 transition-colors duration-300" />
              </div>
            </div>

            <div className="group backdrop-blur-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:border-orange-500/40 rounded-2xl p-6 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">
                    Low Stock Items
                  </p>
                  <p className="text-4xl font-bold text-white mt-2">
                    {lowStockCount}
                  </p>
                </div>
                <AlertCircle className="w-12 h-12 text-orange-400/40 group-hover:text-orange-400 transition-colors duration-300" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Product Inventory
            </h2>
            {products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No products found</p>
                <Link href="/admin/add-product" className="mt-4 inline-block">
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                    Create First Product
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-purple-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
                  >
                    <div className="relative overflow-hidden h-48 bg-gradient-to-br from-slate-700 to-slate-800">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.stock < 5 && (
                        <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Low Stock
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-white line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs font-medium text-purple-300 mt-1">
                          {product.category}
                        </p>
                      </div>

                      <p className="text-sm text-gray-300 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-end justify-between pt-2 border-t border-white/10">
                        <div>
                          <p className="text-3xl font-bold text-white">
                            ₹{product.price}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Stock:{" "}
                            <span
                              className={`font-semibold ${
                                product.stock < 5
                                  ? "text-red-400"
                                  : "text-green-400"
                              }`}
                            >
                              {product.stock}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link
                          href={`/admin/edit-product/${product.id}`}
                          className="flex-1"
                        >
                          <Button className="w-full h-9 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium">
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </Button>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex-1 h-9 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 hover:border-red-500/60 text-red-300 hover:text-red-200 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}