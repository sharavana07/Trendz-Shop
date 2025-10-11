import ProductsNavbar from "@/components/ProductsNavbar";
import Link from "next/link";

type Product = {
  id: string | number;
  name: string;
  price: number;
  image_url: string;
};

// Fetch products from your backend
async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:8000/api/products"); // your API URL
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

// Wrap client components in "use client"
export default async function ProductListPage() {
  const products = await getProducts(); // fetch data on the server

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <ProductsNavbar />

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-8">
        {products.length > 0 ? (
          products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="p-4 bg-violet-900/20 hover:bg-violet-900/40 rounded-xl transition cursor-pointer">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="rounded-md w-full h-48 object-cover"
                />
                <h3 className="mt-2 text-lg font-semibold text-white">{product.name}</h3>
                <p className="text-violet-300">₹{product.price}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-white">No products found.</p>
        )}
      </div>
    </div>
  );
}
