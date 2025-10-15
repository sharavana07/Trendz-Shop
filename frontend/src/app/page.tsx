"use client";

import Navbar from "../components/navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar Component */}
      <Navbar />

      {/* Page Content */}
      <section className="flex flex-col items-center justify-center text-center mt-16">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-blue-600">Trendz Shop</span>
        </h1>
        <p className="text-gray-600 max-w-xl">
          Explore products, manage your orders, or log in as admin to manage the store.
        </p>
      </section>
    </main>
  );
}
