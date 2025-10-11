// app/layout.tsx
"use client";

import "./globals.css";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* Wrap your entire app in SessionProvider and CartProvider */}
        <SessionProvider>
          <CartProvider>{children}</CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
  