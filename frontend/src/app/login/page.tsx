"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import LoginNavbar from "../../components/LoginNavbar";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await signIn("google");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar added at top */}
      <LoginNavbar />

      {/* ✅ Login Box */}
      <div className="max-w-sm mx-auto mt-20 p-6 border border-gray-300 rounded-xl shadow-md text-center bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Login</h2>

        {status === "loading" ? (
          <p className="text-gray-500">Checking session...</p>
        ) : session ? (
          <div>
            <p className="text-gray-700">
              Logged in as <strong>{session.user?.email}</strong>
            </p>
            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={handleGoogleLogin}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Login with Google
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
}
