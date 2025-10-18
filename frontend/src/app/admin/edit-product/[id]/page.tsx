"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, AlertCircle } from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    stock: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) =>
        setForm({
          ...data,
          price: String(data.price),
          stock: String(data.stock),
        })
      )
      .catch((err) => setError("Failed to load product"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
        }),
      });
      router.push("/admin");
    } catch (err) {
      setError("Failed to save product");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 mb-6 text-gray-400 hover:text-purple-400 transition-colors duration-200"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Edit Product</h1>
          <p className="text-gray-400">Update product details and information</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-white/5 rounded-2xl animate-pulse border border-white/10"
              />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Container with Glassmorphism */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/10 transition-shadow duration-300">
              {/* Grid Layout */}
              <div className="space-y-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-200">
                    Product Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl h-12 px-4 focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>

                {/* Category and Price Grid */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-200">
                      Category
                    </label>
                    <Input
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      placeholder="Enter category"
                      className="bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl h-12 px-4 focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-200">
                      Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-500 text-sm font-medium">$</span>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                        required
                        placeholder="0.00"
                        step="0.01"
                        className="bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl h-12 px-4 pl-8 focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <label htmlFor="stock" className="block text-sm font-semibold text-gray-200">
                    Stock Quantity
                  </label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    placeholder="Enter stock quantity"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl h-12 px-4 focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label htmlFor="image_url" className="block text-sm font-semibold text-gray-200">
                    Image URL
                  </label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    required
                    placeholder="https://example.com/image.jpg"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl h-12 px-4 focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-200">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter product description"
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}