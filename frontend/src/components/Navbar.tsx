"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Cart", href: "/cart" },
    { name: "Login", href: "/login" },
    { name: "My Orders", href: "/my-orders" },
    { name: "Admin Login", href: "/adminlogin" },
    { name: "Admin Orders", href: "/admin/orders" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">Trendz Shop</Link>
        </div>
        <div className="space-x-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1 rounded hover:bg-gray-700 ${
                pathname === link.href ? "bg-gray-700" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
