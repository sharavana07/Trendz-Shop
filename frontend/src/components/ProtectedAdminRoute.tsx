"use client";

//forntend/src/components/ProtectionAdminRoute.tsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // don't redirect while loading

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.role !== "admin") {
      router.push("/"); // redirect non-admin users
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return <>{children}</>;
}
