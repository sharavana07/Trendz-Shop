// app/page.tsx
import React from "react";
import Navbar from "../components/navbar"; // adjust path if needed

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-32 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Trendz Shop</h1>
        <p className="text-xl mb-6">Your one-stop destination for the latest electronics</p>
        <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition">
          Shop Now
        </button>
      </section>

      {/* Placeholder for future sections */}
      <section className="max-w-6xl mx-auto py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
        <p className="text-gray-600">Exciting products and deals will appear here soon!</p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <p>&copy; 2025 Trendz Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}
