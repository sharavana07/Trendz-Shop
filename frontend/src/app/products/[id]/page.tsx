import Image from "next/image";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton"; // ✅ new line

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
const { id } = await params; // ✅ fix here
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
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-8 bg-gradient-to-b from-black to-violet-950 text-white">
      {/* Product Image */}
      <div className="flex-1 flex justify-center mb-6 md:mb-0">
        {product?.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={400}
            height={400}
            className="rounded-2xl shadow-lg object-cover"
          />
        ) : (
          <div className="w-96 h-96 bg-gray-800 flex items-center justify-center rounded-2xl">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 md:ml-8 space-y-4">
        <h1 className="text-4xl font-bold">{product?.name}</h1>
        <p className="text-violet-300">{product?.category}</p>
        <p className="text-gray-300">{product?.description}</p>
        <p className="text-2xl font-semibold text-violet-400">₹{product?.price}</p>

        {/* ✅ Add-to-Cart Button Component */}
        {product && (
          <AddToCartButton
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image_url}
          />
        )}
      </div>
    </div>
  );
}
