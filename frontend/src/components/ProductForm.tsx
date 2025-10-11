"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { createProduct } from "../app/api/productApi";

// Define the shape of a product
interface Product {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image_url: string;
  P_ID?: string; // optional if backend generates it
}

// Props for the form component
interface ProductFormProps {
  onSuccess?: () => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  // ✅ Predefined categories
  const categories = [
    { id: "ELEC", name: "Electronics" },
    { id: "CLOT", name: "Clothing" },
    { id: "HOME", name: "Home & Kitchen" },
    { id: "BEAU", name: "Beauty & Personal Care" },
    { id: "SPRT", name: "Sports" },
    { id: "VEG", name: "Veggies" },
    { id: "SAT", name: "Stationery" },
  ];

  const [form, setForm] = useState<
    Omit<Product, "price" | "stock"> & { price: string; stock: string }
  >({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image_url: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const product: Product = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      };

      // Optional: Generate Product ID based on category
      // product.P_ID = `${form.category}-${Date.now()}`;

      await createProduct(product);
      alert("Product added successfully!");
      setForm({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        image_url: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to add product.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-black/30 backdrop-blur-md rounded-2xl text-white space-y-4 max-w-md"
    >
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 rounded-md text-black"
        required
      />

      {/* ✅ Category Dropdown */}
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full p-2 rounded-md text-black"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="w-full p-2 rounded-md text-black"
        required
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
        className="w-full p-2 rounded-md text-black"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full p-2 rounded-md text-black"
      />

      <input
        type="text"
        name="image_url"
        placeholder="Image URL"
        value={form.image_url}
        onChange={handleChange}
        className="w-full p-2 rounded-md text-black"
      />

      <button
        type="submit"
        className="w-full bg-violet-600 hover:bg-violet-700 rounded-xl py-2 font-bold"
      >
        Add Product
      </button>
    </form>
  );
}
