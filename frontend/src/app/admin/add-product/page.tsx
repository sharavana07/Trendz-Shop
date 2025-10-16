"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Package, RotateCcw } from "lucide-react";

export default function AddProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  setError("");
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_URL}/api/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price ? parseFloat(form.price) : 0,
          stock: form.stock ? parseInt(form.stock) : 0,
         }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      router.push("/admin");
    } catch (err) {
      setError("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category: "",
      stock: "",
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Add New Product
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Fill in the details below to create a new product listing
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-black/60 backdrop-blur-md rounded-3xl border border-violet-500/30 shadow-2xl p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Product Name */}
            <div>
              <label className="block text-white font-medium mb-2 text-sm">
                Product Name *
              </label>
              <input
                name="name"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:bg-white/15 transition-all duration-300"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-white font-medium mb-2 text-sm">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:bg-white/15 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="" className="bg-gray-900">
                  Select Category
                </option>

                <optgroup label="Electronics" className="bg-gray-900">
                  <option value="Electronics" className="bg-gray-900">
                    General Electronics
                  </option>
                  <option value="Smartphones" className="bg-gray-900">
                    Smartphones
                  </option>
                  <option value="Laptops" className="bg-gray-900">
                    Laptops
                  </option>
                  <option value="Headphones" className="bg-gray-900">
                    Headphones
                  </option>
                  <option value="Smartwatches" className="bg-gray-900">
                    Smartwatches
                  </option>
                  <option value="Gaming Consoles" className="bg-gray-900">
                    Gaming Consoles
                  </option>
                </optgroup>

                <optgroup label="Fashion & Apparel" className="bg-gray-900">
                  <option value="Fashion & Apparel" className="bg-gray-900">
                    General Fashion
                  </option>
                  <option value="Men's Wear" className="bg-gray-900">
                    Men's Wear
                  </option>
                  <option value="Women's Wear" className="bg-gray-900">
                    Women's Wear
                  </option>
                  <option value="Footwear" className="bg-gray-900">
                    Footwear
                  </option>
                  <option value="Accessories" className="bg-gray-900">
                    Accessories
                  </option>
                </optgroup>

                <optgroup label="Home & Kitchen" className="bg-gray-900">
                  <option value="Home & Kitchen" className="bg-gray-900">
                    General Home & Kitchen
                  </option>
                  <option value="Furniture" className="bg-gray-900">
                    Furniture
                  </option>
                  <option value="Cookware" className="bg-gray-900">
                    Cookware
                  </option>
                  <option value="Home Décor" className="bg-gray-900">
                    Home Décor
                  </option>
                  <option value="Storage" className="bg-gray-900">
                    Storage
                  </option>
                  <option value="Lighting" className="bg-gray-900">
                    Lighting
                  </option>
                </optgroup>

                <optgroup label="Beauty & Personal Care" className="bg-gray-900">
                  <option value="Beauty & Personal Care" className="bg-gray-900">
                    General Beauty
                  </option>
                  <option value="Skincare" className="bg-gray-900">
                    Skincare
                  </option>
                  <option value="Haircare" className="bg-gray-900">
                    Haircare
                  </option>
                  <option value="Grooming Tools" className="bg-gray-900">
                    Grooming Tools
                  </option>
                  <option value="Cosmetics" className="bg-gray-900">
                    Cosmetics
                  </option>
                </optgroup>

                <optgroup label="Sports & Fitness" className="bg-gray-900">
                  <option value="Sports & Fitness" className="bg-gray-900">
                    General Sports
                  </option>
                  <option value="Gym Gear" className="bg-gray-900">
                    Gym Gear
                  </option>
                  <option value="Sportswear" className="bg-gray-900">
                    Sportswear
                  </option>
                  <option value="Outdoor Equipment" className="bg-gray-900">
                    Outdoor Equipment
                  </option>
                  <option value="Yoga Mats" className="bg-gray-900">
                    Yoga Mats
                  </option>
                </optgroup>

                <optgroup label="Books & Stationery" className="bg-gray-900">
                  <option value="Books & Stationery" className="bg-gray-900">
                    General Books
                  </option>
                  <option value="Novels" className="bg-gray-900">
                    Novels
                  </option>
                  <option value="Notebooks" className="bg-gray-900">
                    Notebooks
                  </option>
                  <option value="Pens" className="bg-gray-900">
                    Pens
                  </option>
                  <option value="Planners" className="bg-gray-900">
                    Planners
                  </option>
                  <option value="Educational Material" className="bg-gray-900">
                    Educational Material
                  </option>
                </optgroup>

                <optgroup label="Toys & Games" className="bg-gray-900">
                  <option value="Toys & Games" className="bg-gray-900">
                    General Toys
                  </option>
                  <option value="Board Games" className="bg-gray-900">
                    Board Games
                  </option>
                  <option value="Puzzles" className="bg-gray-900">
                    Puzzles
                  </option>
                  <option value="Action Figures" className="bg-gray-900">
                    Action Figures
                  </option>
                  <option value="Baby Toys" className="bg-gray-900">
                    Baby Toys
                  </option>
                </optgroup>

                <optgroup label="Groceries & Essentials" className="bg-gray-900">
                  <option
                    value="Groceries & Essentials"
                    className="bg-gray-900"
                  >
                    General Groceries
                  </option>
                  <option value="Snacks" className="bg-gray-900">
                    Snacks
                  </option>
                  <option value="Beverages" className="bg-gray-900">
                    Beverages
                  </option>
                  <option value="Cleaning Supplies" className="bg-gray-900">
                    Cleaning Supplies
                  </option>
                  <option value="Personal Hygiene" className="bg-gray-900">
                    Personal Hygiene
                  </option>
                </optgroup>

                <optgroup label="Automotive Accessories" className="bg-gray-900">
                  <option
                    value="Automotive Accessories"
                    className="bg-gray-900"
                  >
                    General Automotive
                  </option>
                  <option value="Car Care" className="bg-gray-900">
                    Car Care
                  </option>
                  <option value="Bike Accessories" className="bg-gray-900">
                    Bike Accessories
                  </option>
                  <option value="Tools" className="bg-gray-900">
                    Tools
                  </option>
                  <option value="Helmets" className="bg-gray-900">
                    Helmets
                  </option>
                </optgroup>

                <optgroup label="Pet Supplies" className="bg-gray-900">
                  <option value="Pet Supplies" className="bg-gray-900">
                    General Pet Supplies
                  </option>
                  <option value="Food" className="bg-gray-900">
                    Food
                  </option>
                  <option value="Grooming" className="bg-gray-900">
                    Grooming
                  </option>
                  <option value="Toys" className="bg-gray-900">
                    Toys
                  </option>
                  <option value="Leashes" className="bg-gray-900">
                    Leashes
                  </option>
                  <option value="Bedding" className="bg-gray-900">
                    Bedding
                  </option>
                </optgroup>
              </select>
            </div>

            {/* Price and Stock - Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Price (₹) *
                </label>
                <input
                  name="price"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:bg-white/15 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2 text-sm">
                  Stock Quantity *
                </label>
                <input
                  name="stock"
                  placeholder="0"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:bg-white/15 transition-all duration-300"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-white font-medium mb-2 text-sm">
                Image URL *
              </label>
              <div className="relative">
                <Upload className="absolute left-3 top-3 w-5 h-5 text-violet-400 pointer-events-none" />
                <input
                  name="image_url"
                  placeholder="https://cloudinary.com/your-image-url"
                  value={form.image_url}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:bg-white/15 transition-all duration-300"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-2 text-sm">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter product description..."
                value={form.description}
                onChange={handleChange}
                rows="5"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:bg-white/15 transition-all duration-300 resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-violet-500/50"
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <p className="text-center text-gray-500 text-xs">
          All fields marked with * are required
        </p>
      </div>
    </div>
  );
}