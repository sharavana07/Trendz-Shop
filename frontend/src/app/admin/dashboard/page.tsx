"use client";

// frontend/src/app/admin/dashboard/page.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import ProtectedAdminRoute from "../../../components/ProtectedAdminRoute";

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

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <ProtectedAdminRoute>
      <div className="p-10 space-y-6">
        {/* Welcome / Quick Links */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="space-x-2">
            <Link href="/admin/add-product">
              <Button>Add Product</Button>
            </Link>
            <Link href="/admin/edit-product">
              <Button variant="outline">Edit Products</Button>
            </Link>
          </div>
        </div>

        {/* Stats / Summary */}
        <div className="flex space-x-4">
          <Card className="flex-1 p-4 text-center">
            <h2 className="text-xl font-semibold">Total Products</h2>
            <p className="text-2xl mt-2">{products.length}</p>
          </Card>
          <Card className="flex-1 p-4 text-center">
            <h2 className="text-xl font-semibold">Low Stock</h2>
            <p className="text-2xl mt-2">
              {products.filter((p) => p.stock < 5).length}
            </p>
          </Card>
        </div>

        {/* Product List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="rounded-xl shadow-lg">
              <CardContent className="p-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="rounded-md w-full h-40 object-cover"
                />
                <h2 className="text-xl font-semibold mt-3">{product.name}</h2>
                <p className="text-sm text-gray-400">{product.category}</p>
                <p className="text-sm mt-2">{product.description}</p>
                <p className="font-bold mt-2">₹{product.price}</p>
                <p className="text-sm mt-1 text-gray-500">
                  Stock: <span className="font-semibold">{product.stock}</span>
                </p>
                <div className="flex justify-between mt-3">
                  <Link href={`/admin/edit-product/${product.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
