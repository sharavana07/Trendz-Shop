"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://127.0.0.1:8000/api/products/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      }),
    });
    router.push("/admin");
  };

  return (
    <div className="max-w-lg mx-auto p-10 space-y-5">
      <h1 className="text-2xl font-bold text-center">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" placeholder="Product Name" onChange={handleChange} required />
        <Input name="category" placeholder="Category" onChange={handleChange} required />
        <Input name="price" placeholder="Price" type="number" onChange={handleChange} required />
        <Input name="stock" placeholder="Stock Quantity" type="number" onChange={handleChange} required />
        <Input name="image_url" placeholder="Cloudinary Image URL" onChange={handleChange} required />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 rounded-md"
          onChange={handleChange}
        />
        <Button type="submit" className="w-full">Add Product</Button>
      </form>
    </div>
  );
}
