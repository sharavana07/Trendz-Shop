"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

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
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 10,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2>User Login</h2>

      {status === "loading" ? (
        <p>Checking session...</p>
      ) : session ? (
        <div>
          <p>Logged in as <strong>{session.user?.email}</strong></p>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={handleGoogleLogin}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4285F4",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            Login with Google
          </button>
        </div>
      )}

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}
