"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) =>
        setForm({
          ...data,
          price: String(data.price),
          stock: String(data.stock),
        })
      );
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  return (
    <div className="max-w-lg mx-auto p-10 space-y-5">
      <h1 className="text-2xl font-bold text-center">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" value={form.name} onChange={handleChange} required />
        <Input name="category" value={form.category} onChange={handleChange} required />
        <Input name="price" type="number" value={form.price} onChange={handleChange} required />
        <Input name="stock" type="number" value={form.stock} onChange={handleChange} required />
        <Input name="image_url" value={form.image_url} onChange={handleChange} required />
        <textarea
          name="description"
          className="w-full border p-2 rounded-md"
          value={form.description}
          onChange={handleChange}
        />
        <Button type="submit" className="w-full">Save Changes</Button>
      </form>
    </div>
  );
}
