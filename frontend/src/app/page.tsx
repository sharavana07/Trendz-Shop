// app/page.tsx
import React from "react";
import Navbar from "../components/navbar"; // adjust path if needed

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 px-4 text-center overflow-hidden">
        {/* Gradient Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20"></div>
        
        {/* Animated Blur Circles */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            Welcome to <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Trendz Shop</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Your one-stop destination for the latest electronics
          </p>
          <button 
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
            aria-label="Shop now for electronics"
          >
            <span className="relative z-10">Shop Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Premium Quality",
              description: "Top-tier electronics from trusted brands",
              icon: "🏆"
            },
            {
              title: "Fast Shipping",
              description: "Get your products delivered quickly and safely",
              icon: "🚀"
            },
            {
              title: "24/7 Support",
              description: "Our team is always here to help you",
              icon: "💬"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
              role="article"
              aria-label={feature.title}
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="max-w-6xl mx-auto py-20 px-4 text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
          <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full">
            <span className="text-white font-semibold text-sm uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Exciting Products Ahead
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Exciting products and deals will appear here soon! Stay tuned for amazing offers on the latest electronics.
          </p>
          
          {/* Newsletter Signup */}
          <div className="mt-10 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                aria-label="Email address for newsletter"
              />
              <button 
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 whitespace-nowrap"
                aria-label="Notify me about new products"
              >
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Trendz Shop
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your trusted destination for cutting-edge electronics and unbeatable deals.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-500 transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-500 transition-colors duration-200">Products</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-500 transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-500 transition-colors duration-200">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-500 transition-colors duration-200">Shipping</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-500 transition-colors duration-200">Returns</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 Trendz Shop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}