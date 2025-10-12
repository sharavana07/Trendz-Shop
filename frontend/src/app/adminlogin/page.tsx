"use client";

//src/app/login/page.tsx

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username: form.username,
      password: form.password,
    });

    if (res?.error) setError("Invalid credentials");
    else router.push("/admin");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-xl border border-gray-700 bg-black/30 backdrop-blur-lg space-y-4 w-80"
      >
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <Input name="username" placeholder="Username" onChange={handleChange} required />
        <Input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
}
